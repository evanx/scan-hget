# hget

Containerized utility to scan Redis keys and hget a field of any hashes.

<img src='https://raw.githubusercontent.com/evanx/hget/master/docs/readme/images/options.png'>


## Config

See `app/config.js`
```javascript
    required: {
        pattern: {
            description: 'the matching pattern for Redis scan',
            example: '*'
        },
        field: {
            description: 'name of the hashes field to print'
        },
        limit: {
            default: 30,
            description: 'the maximum number of keys to print',
            note: 'zero means unlimited',
            example: 0
        },
        redisUrl: {
            default: 'redis://localhost:6379',
            description: 'the Redis URL'
        },
        format: {
            default: 'terse',
```
where the default `redisUrl` is `'redis://localhost:6379'`

## Implementation

See `app/index.js`
```javascript
    const [result] = await multiExecAsync(client, multi => {
        multi.scan(cursor || 0, 'match', config.pattern);
    });
    cursor = parseInt(result[0]);
    const keys = result[1];
    if (config.format === 'key') {
        keys.forEach(key => {
            console.log(key);
            count++;
        });
    } else {
        const types = await multiExecAsync(client, multi => {
            keys.forEach(key => multi.type(key));
        });
        const hashesKeys = keys.filter((key, index) => types[index] === 'hash');
        if (hashesKeys.length) {
            if (config.format === 'hkeys') { // undocumented feature
                count += hashesKeys.length;
                const results = await multiExecAsync(client, multi => {
                    hashesKeys.forEach(key => multi.hkeys(key));
                });
                hashesKeys.forEach((key, index) => {
                    const result = results[index];
                    console.log(`${clc.cyan(key)} ${result.join(' ')}`);
                });
            } else {
                const hget = await multiExecAsync(client, multi => {
                    hashesKeys.forEach(key => multi.hget(key, config.field));
                });
                hashesKeys.map((key, index) => [key, hget[index]])
                .filter(([key, value]) => value && value !== 'null')
                .map(([key, value]) => {
                    count++;
                    if (config.format === 'both') {
                        console.log(`${clc.cyan(key)} ${value}`);
                    } else if (config.format === 'value') {
                        console.log(value);
                    } else if (config.format === 'json') {
                        console.log(JSON.stringify(JSON.parse(value), null, 2));
                    } else {
                        assert(false, 'format');
                    }
                });
            }
            if (config.limit > 0 && count > config.limit) {
                console.error(clc.yellow('Limit exceeded. Try: limit=0'));
                break;
            }
        }
    }
```

## Docker

```shell
docker build -t hget https://github.com/evanx/hget.git
```
where tagged as image `hget`

```shell
docker run --network=host -e pattern='*' hget | head
```
where `--network-host` connects the container to your `localhost` bridge. The default `redisUrl` of `redis://localhost:6379` works in that case.

As such, you should inspect the source:
```shell
git clone https://github.com/evanx/hget.git
cd hget
cat Dockerfile
```
```
FROM node:7.4.0
ADD package.json .
RUN npm install
ADD components components
ADD app app
ENV NODE_ENV production
CMD ["node", "--harmony", "app/index.js"]
```

Having reviewed the code, you can also execute as follows:
```
cat package.json
npm install
pattern='*' npm start
```

https://twitter.com/@evanxsummers
