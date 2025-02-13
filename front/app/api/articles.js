import connectDB from "../../lib/mongodb";
import Article from "../models/article";


export default async function handler(req, res) {
    // console.log("caca");
    await connectDB();

    if (req.method === "GET") {
        try {
            const articles = await Article.find();
            res.status(200).json(articles);
        } catch (error) {
            res.status(500).json({ message: "Erreur serveur", error });
        }
    } else if (req.method === "POST") {
        try {
            const { title, content, picture } = req.body;
            const newArticle = new Article({ title, content, picture });
            await newArticle.save();
            res.status(201).json(newArticle);
        } catch (error) {
            res.status(500).json({ message: "Erreur serveur", error });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).json({ message: `Méthode ${req.method} non autorisée` });
    }
}

