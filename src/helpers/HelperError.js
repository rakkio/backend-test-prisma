
const validateFields = (fields, body) => {
    for (const field of fields) {
        if (!body[field]) return false
    }
    return true
}


const sendError = (res, status, message, error = null) => {
    if (error) console.error(error)
    return res.status(status).json({ message, error: error ? error.message : undefined })
}


export { sendError, validateFields }




