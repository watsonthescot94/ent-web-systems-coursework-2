import mongoose from 'mongoose'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        required: "Email address required",
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    username: {
        type: String,
        trim: true,
        maxLength: [15, "Username must be no longer than 15 characters"],
        unique: true,
        required: "Username required",
        match: [/^\S*$/, "Username must not contain spaces"]
    },
    hashed_password: {
        type: String,
        required: "Password required"
    },
    admin: {
        type: Boolean, 
        default: false
    },
    avatar: {
        type: String,
        default: "default_avatar.jpg"
    },
    salt: String,
    updated: Date,
    created: {
      type: Date,
      default: Date.now
    }
})

UserSchema
    .virtual("password")
    .set(function(password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
        return this._password
})

UserSchema.methods = {
    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password) {
      if (!password) return ""
      try {
        return crypto
          .createHmac('sha256', this.salt)
          .update(password)
          .digest('hex')
      } catch (err) {
        return ""
      }
    },
    makeSalt: function() {
      return Math.round((new Date().valueOf() * Math.random())) + ""
    }
}

UserSchema.path("hashed_password").validate(function() {
    if (this._password && this._password.length < 6) {
      this.invalidate("password", "Password must contain at least 6 characters")
    }
    if (this.isNew && !this._password) {
      this.invalidate("password", "Password required")
    }
  }, null)

const userModel = mongoose.model("User", UserSchema, "users");
userModel.createIndexes();
export default userModel