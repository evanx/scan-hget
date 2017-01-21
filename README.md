# hget

Containerized utility to scan Redis keys and hget a field of any hashes.

<img src='https://raw.githubusercontent.com/evanx/hget/master/docs/readme/images/options.png'>


## Use case

Sample data
```
redis-cli hset mytest:1001:h err some_error
redis-cli hset mytest:1002:h err other_error
```
where we might have the field `err` on some hashes keys.

We wish to perform a query on this specific field e.g. as follows using `bash` and `redis-cli`
```
for key in `redis-cli keys 'mytest:*:h'`
do
  echo $key `redis-cli hget $key err`
done
```
```
mytest:1001:h some_error
mytest:1002:h other_error
```

## Usage

Use `format=both` to print the key and the field value:
```
pattern='mytest*' format=both field=err npm start
```
where we have specified the `err` field for the query.
```
mytest:1002:h other_error
mytest:1001:h some_error
```
where the hash key and the value of its `err` field have been printed.

Otherwise `format=value` will print only the field value:
```
pattern='mytest*' format=value field=err npm start
```
```
other_error
some_error
```

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
    let cursor;
    while (true) {
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
```

## Docker

```shell
docker build -t hget https://github.com/evanx/hget.git
```
where we tag the image as `hget`

```shell
docker run --network=host -e pattern='authbot:*' -e field=role -e format=both hget
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

### Prebuilt image demo

```
evan@dijkstra:~$ docker run --network=redis \
  -e redisUrl=redis://$redisHost:6379 \
  -e pattern='authbot:*' -e field=role -e format=both \
  evanxsummers/hget
```
where rather than using `--network=host` we have a Redis container with IP address `$redisHost` on a network bridge called `redis`

https://twitter.com/@evanxsummers
