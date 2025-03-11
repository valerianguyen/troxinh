-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: thuecanho
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'https://picsum.photos/id/237/200/300','Đỗ Trọng Hoàng',0,'0865355604','anhanh2@gmail.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC','Hà nội','2024-11-10 13:45:50','2025-03-05 15:09:29',7),(2,'https://picsum.photos/id/237/200/300','Nguyen Tran',2,NULL,'anhanh1@gmail.com','$2b$10$gvdOfp3OdaHIXg2HBi1U0.s7g9aIxqzXmYV1aa0bjeQGrQH8LRAuq',NULL,'2024-11-10 13:45:54','2025-03-05 15:09:09',10),(3,'https://picsum.photos/id/237/200/300','Nguyen Tran',1,'0865355604','anhanh3@gmail.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC','Ha Noi','2024-11-10 13:59:35','2025-03-05 13:49:34',8),(4,'https://picsum.photos/id/237/200/300','Hoang D',0,'0864312563','anhanh4@gmail.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC','Hà nội','2024-11-11 10:47:37','2025-03-01 15:36:50',6),(5,'https://picsum.photos/id/237/200/300','Nguyen Tran',1,NULL,'anhanh5@gmail.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC',NULL,'2024-11-13 04:10:40','2025-03-04 16:45:52',6),(6,'https://picsum.photos/id/237/200/300','Nguyen Tran',0,NULL,'anhanh6@gmail.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC',NULL,'2024-11-13 06:37:23','2025-02-23 20:19:39',6),(7,'https://picsum.photos/id/237/200/300','Hoang Dep Trai',0,NULL,'admin@admin.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC',NULL,'2024-11-13 17:12:46','2024-11-14 10:03:43',0),(8,'https://picsum.photos/id/237/200/300','Hoang Dep',0,NULL,'test0@dev.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC',NULL,'2024-11-13 17:16:17','2025-02-15 18:02:13',0),(9,'https://picsum.photos/id/237/200/300','Hoang Dep',0,NULL,'test1@dev.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC',NULL,'2024-11-13 17:17:16','2024-11-13 17:17:16',0),(10,'https://picsum.photos/id/237/200/300','Hoang Dep',0,NULL,'test2@dev.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC',NULL,'2024-11-13 17:17:28','2024-12-03 06:09:01',0),(11,'https://picsum.photos/id/237/200/300','Admin dep trai',0,NULL,'admin1@admin.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC',NULL,'2024-11-13 17:19:13','2024-12-03 06:08:54',0),(12,'https://picsum.photos/id/237/200/300','Nguyen Tran',1,'0865356604','anhanh7@gmail.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC','ha noi','2024-11-13 17:20:08','2025-03-01 15:27:08',9),(13,'https://picsum.photos/id/237/200/300','Admin dep trai 66',0,NULL,'admin3@admin.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC',NULL,'2024-11-13 17:21:54','2024-11-13 17:21:54',0),(14,'https://picsum.photos/id/237/200/300','admin4',0,NULL,'admin4@admin.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC',NULL,'2024-11-13 17:23:01','2024-11-21 17:22:49',0),(15,'https://picsum.photos/id/237/200/300','Hoangb do',0,NULL,'anhanh8@gmail.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC',NULL,'2024-11-19 15:17:53','2024-11-21 17:22:48',0),(16,'https://picsum.photos/id/237/200/300','Nguyen Tran',0,'0941510773','trannguyen0773@gmail.com','$2b$10$ebfzvARtDpJfV88IqZ2i.u1hKlTqnZV5R8UpHer1LwyogKb6aI2lC','HCM','2024-11-20 07:59:23','2024-11-27 16:00:21',0),(17,'https://picsum.photos/id/237/200/300','Hoàng Đỗ',0,NULL,'anhanh10@gmail.com','$2b$10$Ih/sUlkv12Qqu2wEduyPteAclsYsA5z0Axu2UXWz7fLEZxNKNP9lS',NULL,'2025-03-01 14:43:44','2025-03-01 14:44:23',0);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-06 20:12:18
