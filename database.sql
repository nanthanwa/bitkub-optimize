-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: x.x.x.x:3306
-- Generation Time: Dec 09, 2020 at 12:22 PM
-- Server version: 10.3.27-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bitkub`
--

-- --------------------------------------------------------

--
-- Table structure for table `log_trading`
--

CREATE TABLE `log_trading` (
  `ID` bigint(50) NOT NULL,
  `Hash` varchar(30) NOT NULL,
  `Symbol` enum('THB_BTC','THB_ETH','THB_WAN','THB_ADA','THB_OMG','THB_BCH','THB_USDT','THB_LTC','THB_XRP','THB_BSV','THB_ZIL','THB_SNT','THB_CVC','THB_LINK','THB_GNT','THB_IOST','THB_ZRX','THB_KNC','THB_ENG','THB_RDN','THB_ABT','THB_MANA','THB_INF','THB_CTXC','THB_XLM','THB_SIX','THB_JFIN','THB_EVX','THB_BNB','THB_POW','THB_DOGE','THB_DAI','THB_USDC','THB_BAT','THB_BAND','THB_KSM','THB_DOT','THB_NEAR') NOT NULL,
  `Side` enum('buy','sell') NOT NULL,
  `Type` enum('limit','market') NOT NULL,
  `Amount` float NOT NULL,
  `Rate` float NOT NULL,
  `Fee` float NOT NULL,
  `Credit` float NOT NULL,
  `Receive` float NOT NULL,
  `Timestamp` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `log_tradingview`
--

CREATE TABLE `log_tradingview` (
  `ID` int(11) NOT NULL,
  `Timestamp` datetime NOT NULL,
  `Exchange` varchar(10) NOT NULL,
  `Ticker` varchar(10) NOT NULL,
  `Timeframe` enum('4h','6h','8h','12h','1d') NOT NULL,
  `Side` enum('buy','sell') NOT NULL,
  `Open` float NOT NULL,
  `Close` float NOT NULL,
  `High` float NOT NULL,
  `Low` float NOT NULL,
  `Volume` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `log_trading`
--
ALTER TABLE `log_trading`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `log_tradingview`
--
ALTER TABLE `log_tradingview`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `log_tradingview`
--
ALTER TABLE `log_tradingview`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
