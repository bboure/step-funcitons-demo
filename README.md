# Validate a task

```
aws stepfunctions send-task-success --task-token 'acbdef' --task-output '{ "reason": "OK" }'
```

# Reject a task

```
aws stepfunctions send-task-failure --task-token 'acbdef' --error 'Error' --cause 'Some Failure cause'
```
