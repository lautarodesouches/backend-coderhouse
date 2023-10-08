import EErrors from '../class/error/types.js'

export default (err, req, res, next) => {

    console.log(err.cause)

    if (err) {
        switch (err.code) {
            case EErrors.INVALID_TYPE_ERROR:

                return res.send({ status: 'error', error: err.name })

            default:
                return res.send({ status: 'error', error: err })
        }
    }

    next()

}