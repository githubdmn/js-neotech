# js-neotech

Neotech technical task

`microesrvice` and the `main` branch are the same and they represent microservice simulation of the task
issues that this option has is `There is no matching message handler defined in the remote service.`
also on branch `medior` there's a monolith option done, fully working

### run steps

1. use specific node version via command `nvm use`, this step is required if `nvm` is used, otherwise skip this step
2. to install all dependencies run `yarn`
3. in case of having yarn globally installed run `yarn run start:dev`

in case environment variables are needed for docker mongodb, just rename `.env.example` to `.env`

### database

```
{"_id":{"$oid":"655a54b15c3aadef255aa488"},"first_name":"John","last_name":"Smith","balance":{"$numberInt":"432563"}}
{"_id":{"$oid":"655ccc3406b2d09517b7edaa"},"first_name":"Adam","last_name":"Smith","balance":{"$numberInt":"3442"}}
{"_id":{"$oid":"655ccc7506b2d09517b7edab"},"first_name":"Bob","last_name":"Miller","balance":{"$numberInt":"0"}}
```
