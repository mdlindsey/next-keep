const DEFAULT_TTL = 60 * 60 * 1000 // 60min

type PropMeta = Record<string, { updated: number }>
const propMeta:PropMeta = {}

type GenericObject = Record<string, any>
const propStore:GenericObject = {}

async function PropLoader():Promise<any> {}
type PropLoaderObject = Record<string, typeof PropLoader>

async function KeepLoader(props?:PropLoaderObject, ttl:number=DEFAULT_TTL) {
    const promises = []
    for(const key in props) {
        // if its a static value just save and move on
        if (typeof props[key] !== 'function') {
            propStore[key] = props[key]
            continue
        }
        // if its an up-to-date function, skip it
        if ((propMeta[key]?.updated || 0) >= new Date().getTime() - ttl) {
            continue
        }
        // if its an expired function allow it to fire again
        promises.push(props[key]().then(v => Keeper({ [key]: v })))
        propMeta[key] = { updated: new Date().getTime() }
    }
    await Promise.all(promises)
}

type Keep = typeof KeepLoader & { meta: PropMeta, store: GenericObject }
const Keeper = KeepLoader as unknown as Keep

Object.defineProperty(Keeper, 'meta', {
    enumerable: true,
    get: () => propMeta
})
Object.defineProperty(Keeper, 'store', {
    enumerable: true,
    get: () => propStore
})

export default Keeper
