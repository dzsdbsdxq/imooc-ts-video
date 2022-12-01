const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
//将css提取到单独的文件中
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    entry:"./src/main.ts",
    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"main.js"
    },
    resolve:{
        "extensions":['.ts','.js','.json']
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[ MiniCssExtractPlugin.loader,'css-loader'],
                exclude:[
                    path.resolve(__dirname,'src/components')
                ]
            },
            {
                test:/\.css$/,
                use:[MiniCssExtractPlugin.loader,{
                    loader:'css-loader',
                    options:{
                        modules:{
                            mode:'local',
                            localIdentName: "[local]--[hash:base64:5]",
                        }
                    }
                }],
                include:[
                    path.resolve(__dirname,'src/components')
                ]
            },
            {
                test:/\.ts$/,
                use:['ts-loader'],
                exclude:/node_modules/
            }
        ]
    },
    devServer:{
        static:{  //服务器所加载文件的目录
            directory: path.join(__dirname, 'dist'),
        },
        open:true
    },
    plugins:[
        new HtmlWebPackPlugin({
            template:"./public/index.html",
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
    ],
    mode:"production"
}