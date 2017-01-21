# hget

Containerized utility to scan Redis keys and hget a specified hashes field.

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
    pattern: {
        description: 'the matching pattern for Redis scan',
        example: '*'
    },
    field: {
        description: 'name of the hashes field to print'
    },
    limit: {
        description: 'the maximum number of keys to print',
        note: 'zero means unlimited',
        default: 30
    },
    redisUrl: {
        description: 'the Redis URL',
        default: 'redis://localhost:6379'
    },
    format: {
        description: 'the output format',
        options: ['key', 'value', 'both', 'json'],
        default: 'key',
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

Having audited the `Dockerfile` and code, you can build and run as follows:

```shell
docker build -t hget https://github.com/evanx/hget.git
```
where we tag the image as `hget`

```shell
docker run --network=host -e pattern='authbot:*' -e field=role -e format=both hget
```
where `--network-host` connects the container to your `localhost` bridge. The default `redisUrl` of `redis://localhost:6379` works in that case.


### Prebuilt image demo

```
evan@dijkstra:~$ docker run --network=redis \
  -e redisUrl=redis://$redisHost:6379 \
  -e pattern='authbot:*' -e field=role -e format=both \
  evanxsummers/hget
```
where rather than using `--network=host` we have a Redis container with IP address `$redisHost` on a network bridge called `redis`


### Test Redis instance


```
(
  set -u -e -x
  container=`docker run --name test-redis-hget -d tutum/redis`
  redisAuth=`docker logs $container | grep '^\s*redis-cli -a' |
    sed -e 's/^\s*redis-cli -a \(\w*\) .*$/\1/'`
  redisUrl="redis://:$redisAuth@$redisHost:6379"
  redis
)
```

Reset
```
for container in `docker ps -q -f name=test-redis-hget`
do
  docker rm -f $container
done
```

https://twitter.com/@evanxsummers
