import Sequelize from 'sequelize'
import config from '../../config/database'

import User from "../../models/User"
import Project from "../../models/Project"
import Task from '../../models/Task'

const models = [User, Project, Task]

class Database{
  constructor(){
    this.connection = new Sequelize(config)
    this.init()
    this.associate()
  }

  init(){
    models.forEach((model) => model.init(this.connection))
  }

  associate(){
    models.forEach((model) =>{
      if(model.associate){
        model.associate(this.connection.models)
      }
    })
  }
}

export default new Database()