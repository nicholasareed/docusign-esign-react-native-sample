import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';

const version = 'v1';

const storageBackend = new Storage({
    // maximum capacity, default 1000 
    size: 1000,

    // Use AsyncStorage for RN, or window.localStorage for web.
    // If not set, data would be lost after reload.
    storageBackend: AsyncStorage,

    // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: 1000 * 3600 * 24,

    // cache data in the memory. default is true.
    enableCache: true,

    // if data was not found in storage or expired,
    // the corresponding sync method will be invoked and return 
    // the latest data.
    sync : {
        // we'll talk about the details later.
    }
})  

// I suggest you have one(and only one) storage instance in global scope.

// for web
// window.storage = storage;



const storage = {

  set: function (key, obj){

    return storageBackend.save({
      key: version + '-' + key,   // Note: Do not use underscore("_") in key!
      rawData: obj,
      // if not specified, the defaultExpires will be applied instead.
      // if set to null, then it will never expire.
      expires: 1000 * 3600
    });

  },


  // // load
  // var load = storage.load;

  get: function (key){

    return new Promise(function(resolve, reject){

      // for (var i = 1; i < arguments.length; i++) {

      try {

        storageBackend.load({
            key: version + '-' + key,

            // autoSync(default true) means if data not found or expired,
            // then invoke the corresponding sync method
            autoSync: true,

            // syncInBackground(default true) means if data expired,
            // return the outdated data first while invoke the sync method.
            // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
            syncInBackground: true
        }).then(ret => {
            // found data go to then()
            // console.log(ret.userid);
            console.log('STORAGE RESOLVE GET: ret', ret);
            resolve(ret);
        }).catch(err => {
            // any exception including data not found 
            // goes to catch()
            // console.warn(err.message);
            console.log('Storage Failed to find anything for key', key);
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    // resolve({});
                    break;
                case 'ExpiredError':
                    // TODO
                    // resolve({});
                    break;
                default:
                  console.log('STORAGE RESOLVE GET: catch', err);
                  // resolve({});
                  break;
            }
            resolve(null);
        })
      }catch(err){
        console.log('--fail,shoot--');
      }

    });

  }
}



// for react native
global.storage = storage;
