-- Crear la base de datos

CREATE TABLE Customer
(
  customer_id INT PRIMARY KEY,
  email VARCHAR(255)
);

CREATE TABLE Payment
(
  payment_id INT PRIMARY KEY,
  payment_gateway VARCHAR(20)
);

CREATE TABLE Vehicle
(
  vehicle_id INT PRIMARY KEY,
  vehicle_plate VARCHAR(20)
);

CREATE TABLE Report
(
  report_id INT PRIMARY KEY,
  emission_date DATE,
  report_status VARCHAR(20),
  price DECIMAL(10, 2),
  vehicle_id INT,
  payment_id INT,
  FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id),
  FOREIGN KEY (payment_id) REFERENCES Payment(payment_id)
);

CREATE TABLE PurchaseReport
(
  customer_id INT,
  report_id INT,
  PRIMARY KEY (customer_id, report_id),
  FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
  FOREIGN KEY (report_id) REFERENCES Report(report_id)
);

INSERT INTO Customer
  (customer_id, email)
VALUES
  (1, 'juan_daniel@gmail.com'),
  (2, 'maria@example.com'),
  (3, 'pedro@example.com');

-- Agregar datos de prueba a la base de datos

INSERT INTO Payment
  (payment_id, payment_gateway)
VALUES
  (1, 'kiphu'),
  (2, 'transbank');

INSERT INTO Vehicle
  (vehicle_id, vehicle_plate)
VALUES
  (1, 'ABC123'),
  (2, 'XYZ987'),
  (3, 'DEF456'),
  (4, 'GHI789'),
  (5, 'JKL321'),
  (6, 'MNO654'),
  (7, 'PQR987');

INSERT INTO Report
  (report_id, emission_date, report_status, price, vehicle_id, payment_id)
VALUES
  (1, '2023-06-01', 'entregado', 5990, 1, 1),
  (2, '2023-06-02', 'entregado', 5990, 2, 2),
  (3, '2023-06-03', 'error', 5990, 3, 2),
  (4, '2023-06-04', 'entregado', 5990, 4, 2),
  (5, '2023-06-05', 'entregado', 5990, 5, 2),
  (6, '2023-06-06', 'entregado', 5990, 6, 1),
  (7, '2023-06-07', 'entregado', 5990, 7, 2);

INSERT INTO PurchaseReport
  (customer_id, report_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 4),
  (2, 5),
  (3, 6),
  (3, 7);

-- Consulta 1: Se requiere el correo de todos los clientes que hayan comprado más de un informe a la vez mediante la pasarela de pago 'transbank'

SELECT c.customer_id, c.email, COUNT(pr.report_id) as 'Total'
FROM Customer c
  JOIN PurchaseReport pr ON c.customer_id = pr.customer_id
  JOIN Report r ON pr.report_id = r.report_id
  JOIN Payment p ON r.payment_id = p.payment_id
WHERE p.payment_gateway = 'transbank'
GROUP BY c.customer_id, c.email
HAVING COUNT(pr.report_id) > 1;

-- Consulta 2: Devuelve todos los informes comprados que han sido entregados al cliente juan_daniel@gmail.com sin utilizar JOIN

SELECT r.report_id, r.emission_date, r.report_status, r.price
FROM Report r
WHERE r.report_id IN (
      SELECT pr.report_id
  FROM PurchaseReport pr
  WHERE pr.customer_id = (SELECT c.customer_id
  from Customer c
  where c.email = 'juan_daniel@gmail.com') 
  ) AND report_status = 'entregado';

  -- Test en https://onecompiler.com/sqlserver/