import  express  from "express";
import { Hall } from "../entities/Hall";
const router = express.Router();

router.post('/api/createHall', async  (req,res) => {
    const {
        name,
        hall_location,
        hall_capacity, 
        hall_rating ,
        hall_image      
    } = req.body;
    const hall1 : Hall|null = await Hall.findOneBy({name : name});
    if(hall1!=null) res.send("Hall exists!");
    else{
        const hall = Hall.create({
            name,
            hall_location,
            hall_capacity, 
            hall_rating,
            hall_image 
        });
        await hall.save();
        res.send(hall);
    }
});
router.get('/api/getAllHalls', async  (req,res) => {
    const halls: Hall[]|null = await Hall.find();
    res.send(halls);
   
});
export{
    router as HallRouter
}