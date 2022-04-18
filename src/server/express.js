import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'
import blogRoutes from './routes/blog.routes'
import userRoutes from './routes/user.routes'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import MainRouter from './../client/MainRouter'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import theme from './../client/theme'
import devBundle from './devBundle'

const app = express()
const CURRENT_WORKING_DIR = process.cwd()

devBundle.compile(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())
app.use(express.static('public'))
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))
app.use('/', blogRoutes)
app.use('/', userRoutes)

app.get('*', (req, res) => {
  const sheets = new ServerStyleSheets()
  const context = {}
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
          <StaticRouter location={req.url} context={context}>
            <ThemeProvider theme={theme}>
              <MainRouter />
            </ThemeProvider>
          </StaticRouter>
        )
    )

    if (context.url) {
      return res.redirect(303, context.url)
    }

    const css = sheets.toString()
    res.status(200).send(Template({
      markup: markup,
      css: css
    }))
})

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
  }else if (err) {
    res.status(400).json({"error" : err.name + ": " + err.message})
    console.log(err)
  }
})

export default app
