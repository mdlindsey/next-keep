import type { IncomingMessage } from 'http'
import axios, { AxiosRequestConfig } from 'axios'

export class http {
    private static readonly client = { ip: null, ua: null }
    public static useClient(req:IncomingMessage) {
        this.client.ip = req?.connection?.remoteAddress
        this.client.ua = req?.headers?.['user-agent']
    }
    private static async generic(config:AxiosRequestConfig) {
        try {
            console.log(`[${config.method.toUpperCase()}] ${(config.baseURL || '') + config.url}`)
            if (!config.headers) {
                config.headers = {}
            }
            if (this.client.ip) {
                config.headers['x-client-ip'] = this.client.ip
            }
            if (this.client.ua) {
                config.headers['x-client-ua'] = this.client.ua
            }
            const { data, status } = await axios(config)
            return { data, status, error: null }
        } catch(e) {
            try {
                return {
                    data: null,
                    status: e.response.status,
                    error: e.response.data?.message || e.response.errorCode
                }
            } catch(e) {
                return { data: null, status: 500, error: 'unknown error' }
            }
        }
    }
    public static async get(url:string, config?:AxiosRequestConfig) {
        return this.generic({ url, method: 'get', ...config })
    }
    public static async put(url:string, body?:any, config?:AxiosRequestConfig) {
        return this.generic({ url, method: 'put', data: body, ...config })
    }
    public static async post(url:string, body?:any, config?:AxiosRequestConfig) {
        return this.generic({ url, method: 'post', data: body, ...config })
    }
    public static async delete(url:string, config?:AxiosRequestConfig) {
        return this.generic({ url, method: 'delete', ...config })
    }
}
