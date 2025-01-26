import { Request, Response } from 'express';
import { updatelikeDislike } from '../lib/db.js';



export async function feedbackHandler(req: Request, res: Response){
        try{
            const chatbotId = req.body.chatbotId;
            const type = req.body.type;

            const isLike = type === 'like';
            const result = await updatelikeDislike(chatbotId, isLike);
            res.status(200).json({ success: true, result });
        }
        catch(error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }