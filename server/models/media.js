import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
  header: {
    type: String,
    required: true,
  },
  paragraph: {
    type: String,
    required: true,
  },
  backgroundUrl: {
    type: String,
    required: true,
  },
  mediaFormat:{
    type:String,
    required:true,
    enum: ['image', 'video', 'gif']
  },
  alt:{
    type:String,
    required:true
  }
});

const aboutUsSchema = new mongoose.Schema({
  paragraph:{
    type:String,
    required:true
  },
  backgroundUrl:{
    type:String,
    required:true
  }
})

const cards1schema = new mongoose.Schema({
  title:{
    type:String
  },
  description:{
    type:String
  },
  days:{
    type:String
  },
  price:{
    type:String
  },
  backgroundUrl:{
    type:String
  }
})

const cards2schema = new mongoose.Schema({
  title:{
    type:String
  },
  description:{
    type:String
  },
  backgroundUrl:{
    type:String
  }
})

export const AboutUs = mongoose.model("aboutUs",aboutUsSchema)
export const Carousel = mongoose.model("carousels", carouselSchema);
export const Cards1 =mongoose.model("cards1",cards1schema)
export const Cards2 =mongoose.model("cards2",cards2schema)




