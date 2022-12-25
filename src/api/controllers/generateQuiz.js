import {Generate} from '../../models/Generate';
export const generate = async (req,res) => {
   const data = await req.body;
   const newData = new Generate(data);
    try {
        await newData.save();
        res.status(200).json(newData);
    } catch (error) { res.status(404).json({ message: error }) }
}
