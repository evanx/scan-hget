
module.exports = (metas, params, options = {}) => Object.keys(metas).reduce((props, key) => {
    const propMeta = metas[key];
    //console.log('meta', key, propMeta);
    if (params[key]) {
        const value = params[key];
        if (!value.length) {
            throw new Error(`Property '${key}' is empty'`);
        }
        if (propMeta.type === 'integer') {
            props[key] = parseInt(value);
        } else {
            props[key] = value;
        }
    } else if (propMeta.default !== undefined) {
        props[key] = propMeta.default;
    } else if (options.required === false) {
    } else {
        const propMeta = metas[key];
        if (propMeta.required !== false) {
            const parts = [
                `Missing required property '${key}'`
            ];
            if (propMeta.description) {
                parts.push(`for the ${propMeta.description}`);
            }
            if (propMeta.example) {
                parts.push(`e.g. '${propMeta.example}'`);
            }
            throw new Error(parts.join(' '));
        }
    }
    return props;
}, {});
