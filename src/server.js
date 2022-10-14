import "dotenv/config"
import './database/seeders/index'

import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import AdminJSSequelize from "@adminjs/sequelize"
import express from 'express'

import UsersResource from "./resources/UsersResource"
import ProjectsResource from "./resources/ProjectsResource"
import TasksResource from "./resources/TasksResource"

import User from "./models/User"

import locale from './locales/locales'
import theme from "./theme"


AdminJS.registerAdapter(AdminJSSequelize)
const { Sequelize } = require('sequelize')

const start = async () => {
const app = express()

const adminJS = new AdminJS({
    databases: [],
    rootPath: '/admin',
    dashboard:{
        component: AdminJS.bundle('./components/Dashboard/index')
    },
    resources: [UsersResource, ProjectsResource, TasksResource],
    ...locale,
    branding:{
        companyName: "Painel Administrativo",
        logo: false,
        // softwareBrothers: false,
        theme,
    },
})

// const router = AdminJSExpress.buildRouter(adminJS)
const router = AdminJSExpress.buildAuthenticatedRouter(adminJS, {
    authenticate: async (email, password) =>{
        const user = await User.findOne({ where: { email }})

        if(user && (await user.checkPassword(password))){
            return user;
        }
        return false;
    },
    cookiePassword: process.env.SECRET,
})

app.use(adminJS.options.rootPath, router)

app.listen(5000, ()=>{
    console.log("Admin rodando")
})
}
start()