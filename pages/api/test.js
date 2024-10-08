const handler = (req, res) => {
    res.status(200).json({ success: true, message: "API is working" });
  };
  
  export default handler;