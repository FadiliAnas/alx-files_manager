import sha1 from "sha1"
import { ObjectId } from "mongodb"
import dbClient from "../utils/db.js"
import redisClient from "../utils/redis.js"

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body

    if (!email) {
      return res.status(400).json({ error: "Missing email" })
    }

    if (!password) {
      return res.status(400).json({ error: "Missing password" })
    }

    const db = dbClient.client.db(dbClient.database)
    const users = db.collection("users")

    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Already exist" })
    }

    const hashedPassword = sha1(password)
    const result = await users.insertOne({
      email,
      password: hashedPassword,
    })

    return res.status(201).json({
      id: result.insertedId,
      email,
    })
  }

  static async getMe(req, res) {
    const token = req.headers["x-token"]
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const userId = await redisClient.get(`auth_${token}`)
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const db = dbClient.client.db(dbClient.database)
    const users = db.collection("users")
    const user = await users.findOne({ _id: ObjectId(userId) })

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
    })
  }
}

export default UsersController
