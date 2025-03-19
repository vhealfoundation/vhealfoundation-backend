const mongoose = require("mongoose");

const storyContentSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Content image is required"],
  },
  title: {
    type: String, 
    required: [true, "Content title is required"],
  },
  description: {
    type: String,
    required: [true, "Content description is required"],
  },
}); 

const storySchema = new mongoose.Schema({
  coverimage: {
    type: String,
    required: [true, "Cover image is required"],
  },
  title: {
    type: String,
    required: [true, "Story title is required"],
  },
/*   description: {
    type: String,
    required: [true, "Story description is required"],
  }, */
  content: {
    type: [storyContentSchema],
    required: [true, "Content is required"],
  },
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
