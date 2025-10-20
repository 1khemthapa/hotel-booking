
import Booking from "../models/Booking.js"
import Room from '../models/Room.model.js'
import Hotel from '../models/Hotel.model.js'

//Function to Check Availability of Room
export const checkAvailability =async({checkInDate,checkOutDate,room})=>{
    try {
        const booking=await Booking.find({
            room,
            checkInDate:{$lte: checkOutDate},
            checkOutDate:{$gte: checkInDate},
        });
      const isAvailable= booking.length===0
      return isAvailable;
    } catch (error) {
        console.log(error.message)
    }
}

//Api to check availability  of room
//post /api/bookings/check availability
export const checkAvailabilityAPI =async (req,res)=>{
    try {
        const {room,checkInDate,checkOutDate}=req.body;
        const isAvailable= await checkAvailability({checkInDate,checkOutDate,room})
        res.json({success:true,isAvailable})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//API to create a new booking
//post /api/bookings/book

export const createBooking =async(req,res)=>{
    try {
        const {room,checkInDate,checkOutDate,guests}=req.body;
        const user=req.user._id;
        //Before booking check Availablity
        
        const isAvailable =await checkAvailability({checkInDate,checkOutDate,room});

        if(!isAvailable){
            res.json({success:false,message:'Room is not available'})
            
        }
        //Get totalPrice from room
        const roomData =await Room.findById(room).populate('hotel');
        let totalPrice=roomData.pricePerNight;

        //Calculate totalPrice based on nights
        const checkIn=new Date(checkInDate);
        const checkOut=new Date(checkOutDate)
        const timeDiff=checkOut.getTime()-checkIn.getTime()
        const nights=Math.ceil(timeDiff/(1000*3600*24));
        totalPrice *=nights;

        const booking=await Booking.create({
            user,
            room,
            hotel:roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        res.json({success:true,message:'booking created successfully'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:'failed to create booking'})
        
    }
}

//Api to get all booking for a user
//GET /api/bookings/user

export const getUserBookings=async(req,res)=>{
    try {
        const user=req.user._id;
        const bookings=(await Booking.find({user}).populate('room hotel')).toSorted({createdAt:-1})
        res.json({success:true,bookings})
    } catch (error) {
     res.json({success:false,message:'failed to fetch bookings'})   
    }
}

export const getHotelBookings=async(req,res)=>{
    try {
        const hotel= await Hotel.findOne({owner:req.auth.userId});
    if(!hotel){
        return res.json({success:false,message:'No Hotel Found'})
    }

    const bookings=await Booking.find({hotel:hotel._id}).populate('room hotel user').toSorted({createdAt: -1});
    //Total Bookings
    const totalBookings =bookings.length;
    //Total Revenue
    const totalRevenue= bookings.reduce((acc,booking)=>acc+booking.totalPrice,0)

    res.json({success:true,dashboardData:{totalBookings,totalRevenue,bookings}})
    } catch (error) {
       res.json({success:false,message:'failed to fetch bookings'}) 
    }
}