import os
import logging
import blpapi
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/bloomberg/logs/bloomberg_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class PortfolioAnalysis:
    """Portfolio analysis results"""
    returns: float
    volatility: float
    sharpe_ratio: float
    beta: float
    alpha: float
    max_drawdown: float
    var_95: float
    correlation_matrix: pd.DataFrame

@dataclass
class MarketIndicators:
    """Market indicators and signals"""
    rsi: float
    macd: Dict[str, float]
    bollinger_bands: Dict[str, float]
    moving_averages: Dict[str, float]
    volume_analysis: Dict[str, float]

class BloombergService:
    def __init__(self):
        self.api_key = os.getenv('BLOOMBERG_API_KEY')
        if not self.api_key:
            logger.error("BLOOMBERG_API_KEY not found in environment variables")
            raise ValueError("BLOOMBERG_API_KEY not found in environment variables")
        
        # Initialize session options
        self.session_options = blpapi.SessionOptions()
        self.session_options.setServerHost("localhost")
        self.session_options.setServerPort(8194)
        self.session_options.setAuthenticationOptions(f"AuthenticationMode=APPLICATION_ONLY;ApplicationAuthenticationType=APPNAME_AND_KEY;ApplicationKey={self.api_key}")
        
        # Create session
        self.session = None
        logger.info("Bloomberg service initialized")

    def start_session(self):
        """Start a new Bloomberg session with enhanced error handling"""
        try:
            if not self.session:
                self.session = blpapi.Session(self.session_options)
                if not self.session.start():
                    logger.error("Failed to start Bloomberg session")
                    raise ConnectionError("Failed to start Bloomberg session")
                
                if not self.session.openService("//blp/refdata"):
                    logger.error("Failed to open //blp/refdata service")
                    raise ConnectionError("Failed to open //blp/refdata service")
                
                logger.info("Bloomberg session started successfully")
        except Exception as e:
            logger.error(f"Error starting Bloomberg session: {str(e)}")
            raise

    def stop_session(self):
        """Stop the Bloomberg session"""
        if self.session:
            try:
                self.session.stop()
                self.session = None
                logger.info("Bloomberg session stopped successfully")
            except Exception as e:
                logger.error(f"Error stopping Bloomberg session: {str(e)}")
                raise

    def get_portfolio_analysis(
        self,
        securities: List[str],
        weights: List[float],
        start_date: datetime,
        end_date: datetime,
        benchmark: str = "SPX Index"
    ) -> PortfolioAnalysis:
        """
        Perform comprehensive portfolio analysis
        
        Args:
            securities: List of security identifiers
            weights: List of portfolio weights
            start_date: Start date for analysis
            end_date: End date for analysis
            benchmark: Benchmark security for comparison
            
        Returns:
            PortfolioAnalysis object containing various metrics
        """
        try:
            # Get historical price data
            fields = ["PX_LAST", "RETURN_TOT_HOLDING_PER"]
            historical_data = self.get_historical_data(securities + [benchmark], fields, start_date, end_date)
            
            # Convert to pandas DataFrame
            df = pd.DataFrame(historical_data)
            returns = df[securities].pct_change()
            benchmark_returns = df[benchmark].pct_change()
            
            # Calculate portfolio returns
            portfolio_returns = (returns * weights).sum(axis=1)
            
            # Calculate metrics
            volatility = portfolio_returns.std() * np.sqrt(252)
            annual_return = (1 + portfolio_returns.mean()) ** 252 - 1
            risk_free_rate = 0.02  # Assume 2% risk-free rate
            sharpe_ratio = (annual_return - risk_free_rate) / volatility
            
            # Calculate beta and alpha
            covariance = portfolio_returns.cov(benchmark_returns)
            benchmark_variance = benchmark_returns.var()
            beta = covariance / benchmark_variance
            alpha = annual_return - (risk_free_rate + beta * (benchmark_returns.mean() * 252 - risk_free_rate))
            
            # Calculate maximum drawdown
            cumulative_returns = (1 + portfolio_returns).cumprod()
            rolling_max = cumulative_returns.expanding().max()
            drawdowns = cumulative_returns / rolling_max - 1
            max_drawdown = drawdowns.min()
            
            # Calculate Value at Risk (95% confidence)
            var_95 = portfolio_returns.quantile(0.05)
            
            # Calculate correlation matrix
            correlation_matrix = returns.corr()
            
            return PortfolioAnalysis(
                returns=annual_return,
                volatility=volatility,
                sharpe_ratio=sharpe_ratio,
                beta=beta,
                alpha=alpha,
                max_drawdown=max_drawdown,
                var_95=var_95,
                correlation_matrix=correlation_matrix
            )
            
        except Exception as e:
            logger.error(f"Error performing portfolio analysis: {str(e)}")
            raise

    def get_technical_indicators(
        self,
        security: str,
        lookback_period: int = 14
    ) -> MarketIndicators:
        """
        Calculate technical indicators for a security
        
        Args:
            security: Security identifier
            lookback_period: Period for calculating indicators
            
        Returns:
            MarketIndicators object containing various technical indicators
        """
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=lookback_period * 2)
            
            fields = ["PX_LAST", "VOLUME"]
            historical_data = self.get_historical_data([security], fields, start_date, end_date)
            
            df = pd.DataFrame(historical_data[security])
            prices = df["PX_LAST"]
            volumes = df["VOLUME"]
            
            # Calculate RSI
            delta = prices.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=lookback_period).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=lookback_period).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs)).iloc[-1]
            
            # Calculate MACD
            exp1 = prices.ewm(span=12, adjust=False).mean()
            exp2 = prices.ewm(span=26, adjust=False).mean()
            macd_line = exp1 - exp2
            signal_line = macd_line.ewm(span=9, adjust=False).mean()
            
            # Calculate Bollinger Bands
            sma = prices.rolling(window=lookback_period).mean()
            std = prices.rolling(window=lookback_period).std()
            upper_band = sma + (std * 2)
            lower_band = sma - (std * 2)
            
            # Calculate Moving Averages
            ma_20 = prices.rolling(window=20).mean().iloc[-1]
            ma_50 = prices.rolling(window=50).mean().iloc[-1]
            ma_200 = prices.rolling(window=200).mean().iloc[-1]
            
            # Volume Analysis
            avg_volume = volumes.mean()
            volume_sma = volumes.rolling(window=lookback_period).mean().iloc[-1]
            
            return MarketIndicators(
                rsi=rsi,
                macd={
                    "macd_line": macd_line.iloc[-1],
                    "signal_line": signal_line.iloc[-1],
                    "histogram": (macd_line - signal_line).iloc[-1]
                },
                bollinger_bands={
                    "upper": upper_band.iloc[-1],
                    "middle": sma.iloc[-1],
                    "lower": lower_band.iloc[-1]
                },
                moving_averages={
                    "MA20": ma_20,
                    "MA50": ma_50,
                    "MA200": ma_200
                },
                volume_analysis={
                    "current_volume": volumes.iloc[-1],
                    "average_volume": avg_volume,
                    "volume_sma": volume_sma
                }
            )
            
        except Exception as e:
            logger.error(f"Error calculating technical indicators: {str(e)}")
            raise

    def get_option_chain(
        self,
        security: str,
        expiry_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """
        Get option chain data for a security
        
        Args:
            security: Security identifier
            expiry_date: Optional specific expiry date
            
        Returns:
            Dictionary containing option chain data
        """
        try:
            self.start_session()
            refDataService = self.session.getService("//blp/refdata")
            request = refDataService.createRequest("ReferenceDataRequest")
            
            # Add security
            request.append("securities", security)
            
            # Add option chain fields
            fields = [
                "OPT_CHAIN",
                "OPT_STRIKE_PX",
                "OPT_PUT_CALL",
                "OPT_EXPIRE_DT",
                "OPT_IMPLIED_VOLATILITY_BST",
                "OPT_DELTA_MID",
                "OPT_GAMMA_MID",
                "OPT_THETA_MID",
                "OPT_VEGA_MID"
            ]
            
            for field in fields:
                request.append("fields", field)
                
            if expiry_date:
                overrides = request.getElement("overrides")
                override = overrides.appendElement()
                override.setElement("fieldId", "OPT_EXPIRE_DT")
                override.setElement("value", expiry_date.strftime("%Y%m%d"))
            
            # Send request
            self.session.sendRequest(request)
            
            # Process response
            option_data = {
                "calls": [],
                "puts": []
            }
            
            while True:
                event = self.session.nextEvent(500)
                
                for msg in event:
                    security_data = msg.getElement("securityData")
                    field_data = security_data.getElement("fieldData")
                    
                    if field_data.hasElement("OPT_CHAIN"):
                        opt_chain = field_data.getElement("OPT_CHAIN")
                        
                        for i in range(opt_chain.numValues()):
                            option = opt_chain.getValue(i)
                            option_info = {
                                "strike": option.getElementAsFloat("OPT_STRIKE_PX"),
                                "expiry": option.getElementAsString("OPT_EXPIRE_DT"),
                                "implied_vol": option.getElementAsFloat("OPT_IMPLIED_VOLATILITY_BST"),
                                "delta": option.getElementAsFloat("OPT_DELTA_MID"),
                                "gamma": option.getElementAsFloat("OPT_GAMMA_MID"),
                                "theta": option.getElementAsFloat("OPT_THETA_MID"),
                                "vega": option.getElementAsFloat("OPT_VEGA_MID")
                            }
                            
                            if option.getElementAsString("OPT_PUT_CALL") == "CALL":
                                option_data["calls"].append(option_info)
                            else:
                                option_data["puts"].append(option_info)
                
                if event.eventType() == blpapi.Event.RESPONSE:
                    break
            
            return option_data
            
        except Exception as e:
            logger.error(f"Error fetching option chain data: {str(e)}")
            raise
        
        finally:
            self.stop_session()

    def get_company_fundamentals(
        self,
        security: str
    ) -> Dict[str, Any]:
        """
        Get comprehensive company fundamental data
        
        Args:
            security: Security identifier
            
        Returns:
            Dictionary containing fundamental data
        """
        try:
            self.start_session()
            refDataService = self.session.getService("//blp/refdata")
            request = refDataService.createRequest("ReferenceDataRequest")
            
            # Add security
            request.append("securities", security)
            
            # Add fundamental fields
            fields = [
                # Valuation metrics
                "CUR_MKT_CAP",
                "PE_RATIO",
                "PX_TO_BOOK_RATIO",
                "EV_TO_EBITDA",
                "RETURN_ON_EQUITY",
                
                # Financial metrics
                "TOTAL_ASSETS",
                "TOTAL_EQUITY",
                "NET_INCOME",
                "EBITDA",
                "FREE_CASH_FLOW",
                
                # Growth metrics
                "SALES_GROWTH",
                "EPS_GROWTH",
                "EBITDA_GROWTH",
                
                # Dividend metrics
                "DVD_YIELD",
                "DVD_PAYOUT_RATIO",
                
                # Debt metrics
                "TOT_DEBT_TO_TOT_ASSET",
                "TOT_DEBT_TO_TOT_EQY",
                "CURRENT_RATIO",
                
                # Profitability metrics
                "GROSS_MARGIN",
                "OPERATING_MARGIN",
                "NET_MARGIN"
            ]
            
            for field in fields:
                request.append("fields", field)
            
            # Send request
            self.session.sendRequest(request)
            
            # Process response
            fundamental_data = {}
            while True:
                event = self.session.nextEvent(500)
                
                for msg in event:
                    security_data = msg.getElement("securityData")
                    field_data = security_data.getElement("fieldData")
                    
                    for field in fields:
                        if field_data.hasElement(field):
                            fundamental_data[field] = field_data.getElement(field).getValue()
                
                if event.eventType() == blpapi.Event.RESPONSE:
                    break
            
            return fundamental_data
            
        except Exception as e:
            logger.error(f"Error fetching company fundamentals: {str(e)}")
            raise
        
        finally:
            self.stop_session()

    def get_security_data(self, securities: List[str], fields: List[str]) -> Dict[str, Any]:
        """
        Get data for specified securities and fields
        
        Args:
            securities: List of security identifiers
            fields: List of Bloomberg fields to retrieve
            
        Returns:
            Dictionary containing the requested data
        """
        try:
            self.start_session()
            refDataService = self.session.getService("//blp/refdata")
            request = refDataService.createRequest("ReferenceDataRequest")

            # Add securities to request
            for security in securities:
                request.append("securities", security)

            # Add fields to request
            for field in fields:
                request.append("fields", field)

            # Send request
            self.session.sendRequest(request)
            
            # Process response
            response_data = {}
            while True:
                event = self.session.nextEvent(500)
                
                for msg in event:
                    security_data = msg.getElement("securityData")
                    for i in range(security_data.numValues()):
                        security = security_data.getValue(i)
                        ticker = security.getElementAsString("security")
                        field_data = security.getElement("fieldData")
                        
                        response_data[ticker] = {}
                        for field in fields:
                            if field_data.hasElement(field):
                                response_data[ticker][field] = field_data.getElement(field).getValue()

                if event.eventType() == blpapi.Event.RESPONSE:
                    break

            return response_data

        except Exception as e:
            raise Exception(f"Error fetching Bloomberg data: {str(e)}")
        
        finally:
            self.stop_session()

    def get_historical_data(
        self,
        securities: List[str],
        fields: List[str],
        start_date: datetime,
        end_date: datetime
    ) -> Dict[str, Any]:
        """
        Get historical data for specified securities and fields
        
        Args:
            securities: List of security identifiers
            fields: List of Bloomberg fields to retrieve
            start_date: Start date for historical data
            end_date: End date for historical data
            
        Returns:
            Dictionary containing the historical data
        """
        try:
            self.start_session()
            refDataService = self.session.getService("//blp/refdata")
            request = refDataService.createRequest("HistoricalDataRequest")

            # Add securities to request
            for security in securities:
                request.append("securities", security)

            # Add fields to request
            for field in fields:
                request.append("fields", field)

            # Set date range
            request.set("startDate", start_date.strftime("%Y%m%d"))
            request.set("endDate", end_date.strftime("%Y%m%d"))

            # Send request
            self.session.sendRequest(request)
            
            # Process response
            historical_data = {}
            while True:
                event = self.session.nextEvent(500)
                
                for msg in event:
                    security_data = msg.getElement("securityData")
                    ticker = security_data.getElementAsString("security")
                    field_data = security_data.getElement("fieldData")
                    
                    historical_data[ticker] = []
                    for i in range(field_data.numValues()):
                        point = field_data.getValue(i)
                        data_point = {
                            "date": point.getElement("date").getValue(),
                        }
                        for field in fields:
                            if point.hasElement(field):
                                data_point[field] = point.getElement(field).getValue()
                        historical_data[ticker].append(data_point)

                if event.eventType() == blpapi.Event.RESPONSE:
                    break

            return historical_data

        except Exception as e:
            raise Exception(f"Error fetching historical Bloomberg data: {str(e)}")
        
        finally:
            self.stop_session()

    def get_market_data(self, securities: List[str]) -> Dict[str, Any]:
        """
        Get real-time market data for specified securities
        
        Args:
            securities: List of security identifiers
            
        Returns:
            Dictionary containing real-time market data
        """
        try:
            self.start_session()
            refDataService = self.session.getService("//blp/refdata")
            request = refDataService.createRequest("ReferenceDataRequest")

            # Add securities to request
            for security in securities:
                request.append("securities", security)

            # Add common market data fields
            fields = [
                "PX_LAST",  # Last price
                "VOLUME",   # Trading volume
                "BID",      # Bid price
                "ASK",      # Ask price
                "CHG_PCT_1D"  # 1-day price change percentage
            ]
            for field in fields:
                request.append("fields", field)

            # Send request
            self.session.sendRequest(request)
            
            # Process response
            market_data = {}
            while True:
                event = self.session.nextEvent(500)
                
                for msg in event:
                    security_data = msg.getElement("securityData")
                    for i in range(security_data.numValues()):
                        security = security_data.getValue(i)
                        ticker = security.getElementAsString("security")
                        field_data = security.getElement("fieldData")
                        
                        market_data[ticker] = {}
                        for field in fields:
                            if field_data.hasElement(field):
                                market_data[ticker][field] = field_data.getElement(field).getValue()

                if event.eventType() == blpapi.Event.RESPONSE:
                    break

            return market_data

        except Exception as e:
            raise Exception(f"Error fetching market data: {str(e)}")
        
        finally:
            self.stop_session() 