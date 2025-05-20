const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

const port = 4783;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_yuka_misawa", // PostgreSQLのユーザー名に置き換えてください
  host: "localhost",
  database: "db_yuka_misawa", // PostgreSQLのデータベース名に置き換えてください
  password: "pass", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});


app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-customer", async (req, res) => {
  console.log("POSTリクエスト受信:", req.body);
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "顧客が見つかりません" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "サーバーエラー" });
  }
});

app.put("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, industry, contact, location } = req.body;

    const result = await pool.query(
      `UPDATE customers
       SET company_name = $1,
           industry = $2,
           contact = $3,
           location = $4
       WHERE customer_id = $5`,
      [company_name, industry, contact, location, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "顧客が見つかりません" });
    }

    res.json({ message: "更新しました" });
  } catch (err) {
    console.error("PUTエラー:", err);
    console.log("PUT受信:", req.body);
    res.status(500).json({ error: "サーバーエラー" });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "顧客が見つかりません" });
    }

    res.json({ message: "削除しました" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "サーバーエラー" });
  }
});

app.use("/api_yuka_misawa", router);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
