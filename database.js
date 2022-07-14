const mongoose = require('mongoose');

exports.connectMongoose = () => {
    // mongoose.connect('mongodb://192.168.68.107:27017/austhSystem')
    mongoose.connect('mongodb+srv://admin:admin@testcluster.lxlaw.mongodb.net/?retryWrites=true&w=majority')
    .then((e) => console.log(`Connected to mongoDB:${e.connection.host}`))
    .catch(e => console.log(e))
}


const userSchema = new mongoose.Schema(
    {
        name: String,
        username: {
            type: String,
            require: true,
            unique: true,
        },
        password: String,
    }
);

exports.User = mongoose.model("User", userSchema);