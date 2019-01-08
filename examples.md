# examples [restful=true]
根据实体管理 state
## collection-A
### api
`/entities/:id`
### state
```javascript
import vuexCapsule from 'vuex-capsule'
entity:{
  index:{
    ...vuexCapsule.createEntity('collection')
  }
}
```
### method
```javascript
dispatch("collectionOperate", {name: entity, operate, payload})
```
#### name {string} ['']
对应 state 定义的实体名称。

#### operate {string} ['index']
|operate|method|url|mock|stateBasePath|
|:--|:--|:--|:--|:--|
|index|GET|/entities|entities/index.json|state.entity.index|
|create|POST|/entities|entities/post.json|state.entity.index|
|delete|DELETE|/entities/:id|entities/delete.json|state.entity.index|
|update|PUT|/entities/:id|entities/put.json|state.entity.index|


#### payload {object} [{}]
`payload.id`：当 operate 为 `delete`、`update` 时， 必填。


## collection-B
### api
`/entities/:entity_id/attribute/:attribute_id`
### state
```javascript
import vuexCapsule from 'vuex-capsule'n
entity:{
  attribute:{
    index:{
      ...vuexCapsule.createEntity('collection')
    }
  }
}
```
### method
```javascript
dispatch("collectionOperate", {name: entity, attribute, operate, payload})
```
#### name {string} ['']
对应 state 定义的实体名称。

#### attribute {string}
实体属性。

#### operate {string} ['index']
|operate|method|url|mock|stateBasePath|
|:--|:--|:--|:--|:--|
|index|GET|/entities/:entity_id/attribute|entities/attribute/index.json|state.attribute.entity.index|
|create|POST|/entities/:entity_id/attribute|entities/attribute/post.json|state.attribute.entity.index|
|delete|DELETE|/entities/:entity_id/attribute/:attribute_id|entities/attribute/delete.json|state.attribute.entity.index|
|update|PUT|/entities/:entity_id/attribute/:attribute_id|entities/attribute/put.json|state.attribute.entity.index|
|read|GET|/entities/:entity_id/attribute/:attribute_id|entities/attribute/put.json|state.attribute.entity.index|


#### payload {object} [{}]
`payload._pid`：entity_id，必填。
`payload.id`：当 operate 为 `delete`、`update`、`read` 时， 必填。

## single-A
### api
`/entities/:id`
### state
```javascript
import vuexCapsule from 'vuex-capsule'
entity:{
  update: {
    ...vuexCapsule.createEntity('single')
  },
  create: {
    ...vuexCapsule.createEntity('single')
  },
  delete: {
    ...vuexCapsule.createEntity('single')
  },
  read: {
    ...vuexCapsule.createEntity('single')
  }
}
```
### method
```javascript
dispatch("entityOperate", {name: entity, operate, payload})
```
#### name {string} ['']
对应 state 定义的实体名称。

#### operate {string} ['index']
|operate|method|url|mock|stateBasePath|
|:--|:--|:--|:--|:--|
|index|GET|/entities|entities/index.json|state.entity.index|
|create|POST|/entities|entities/post.json|state.entity.create|
|delete|DELETE|/entities/:id|entities/delete.json|state.entity.delete|
|update|PUT|/entities/:id|entities/put.json|state.entity.update|
|read|GET|/entities/:id|entities/get.json|state.entity.read|
|reset|-|-|-|对 `state.entity.read.data` 进行重置|

#### payload {object} [{}]
`payload.id`：当 operate 为 `delete`、`update`、`read` 时， 必填。

## single-B
### api
`/entities/:entity_id/attribute/:attribute_id`
### state
```javascript
import vuexCapsule from 'vuex-capsule'
entity:{
  attribute:{
    update: {
      ...vuexCapsule.createEntity('single')
    },
    create: {
      ...vuexCapsule.createEntity('single')
    },
    delete: {
      ...vuexCapsule.createEntity('single')
    },
    read: {
      ...vuexCapsule.createEntity('single')
    }
  }
}
```
### method
```javascript
dispatch("entityOperate", {name: entity, operate, payload})
```
#### name {string} ['']
对应 state 定义的实体名称。

#### operate {string} ['index']
|operate|method|url|mock|stateBasePath|
|:--|:--|:--|:--|:--|
|index|GET|/entities/:entity_id/attribute|entities/attribute/index.json|state.entity.attribute.index|
|create|POST|/entities/:entity_id/attribute|entities/attribute/post.json|state.entity.attribute.create|
|delete|DELETE|/entities/:entity_id/attribute/:attribute_id|entities/attribute/delete.json|state.entity.attribute.delete|
|update|PUT|/entities/:entity_id/attribute/:attribute_id|entities/attribute/put.json|state.entity.attribute.update|
|read|GET|/entities/:entity_id/attribute/:attribute_id|entities/attribute/put.json|state.entity.attribute.read|
|reset|-|-|-|对 `state.entity.attribute.read.data` 进行重置 |
operate 为 `reset` 时，修改的是 `state.entity.attribute.read` 的数据
#### payload {object} [{}]
`payload._pid`：entity_id，必填。
`payload.id`：当 operate 为 `delete`、`update`、`read` 时， 必填。

