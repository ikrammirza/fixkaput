import service from "../../models/Service"
import connectDb from "../../middleware/mongoose"
import Service from "../../models/Service"

const handler = async (req, res) => {
    if (req.method == 'POST') {
        for (let i = 0; i < req.body.length; i++) {
            let s = new Service({
                title: req.body[i].title,
                desc: req.body[i].desc,
                img: req.body[i].img,
                category: req.body[i].category,
                color: req.body[i].color,
                price: req.body[i].price,
                size: req.body[i].size,
                availableQty: req.body[i].availableQty,
                slug: req.body[i].slug,
            })
            await s.save()
        }
        res.status(200).json({ success: "success" })
    }
    else {
        res.status(400).json({ error: "this method is not allowed" })
    }



}
export default connectDb(handler);