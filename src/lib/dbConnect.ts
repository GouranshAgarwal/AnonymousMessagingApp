import mongoose from "mongoose";

type ConnectionObject = {   // tells the type of data that the connection object is returning 
    isConnected?: Number, //it return a number that's why we declared a number here. The question mark tells that it might not be there (not retured anything)
} // not compulsory to make this type object 

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> { // void tells that it does not care what type of data is coming
    if(connection.isConnected){
        console.log("database is already connected");
        return 
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {}); //you can pass options while connecting to database
        // console.log(db); // to see what we need to take from the response 
        connection.isConnected = db.connections[0].readyState; // readyState gives a number that we are passing to the isconnection variable that we defined earlier in the type
        console.log("db connected successfully")

    } catch (error) {
        console.log("db connection failed", error);
        process.exit(1);
    }
}

export default dbConnect;

