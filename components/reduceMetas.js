
module.exports = (metas, params, options = {}) => Object.keys(metas).reduce((props, key) => {
    const meta = metas[key];
    if (options.debug) {
        console.log('meta', key, meta);
    }
    if (params[key]) {
        const value = params[key];
        if (!value.length) {
            throw new Error(`Property '${key}' is empty'`);
        }
        if (meta.type === 'integer') {
            props[key] = parseInt(value);
        } else {
            props[key] = value;
        }
    } else if (meta.default !== undefined) {
        props[key] = meta.default;
    } else if (options.required === false) {
    } else if (!props[key]) {
        const meta = metas[key];
        if (meta.required !== false) {
            const parts = [
                `Missing required property '${key}'`
            ];
            if (meta.description) {
                parts.push(`for the ${meta.description}`);
            }
            if (meta.example) {
                parts.push(`e.g. '${meta.example}'`);
            }
            throw new Error(parts.join(' '));
        }
    }
    return props;
}, options.defaults || {});
