import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import {
  firestore_fieldvalue,
  fire_auth,
  //   fire_auth_provider,
  //   fire_functions,
  fire_store,
  fire_storage,
} from "@/firebase/init";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  state: {
    auth: null,
    userData: {},
    questionFolders: {},
    batches: {},
    questionCount: {},
  },
  getters: {
    auth: (state) => {
      return state.auth;
    },
    userData: (state) => {
      return state.userData;
    },
    questionFolders: (state) => {
      return state.questionFolders;
    },
    batches: (state) => {
      return state.batches;
    },
    questionCount: (state) => {
      return state.questionCount;
    },
  },
  mutations: {
    // Contact Form
    submitContactForm: (context, payload) => {
      const ref = fire_store.collection("messages").doc();
      return new Promise((resolve, reject) => {
        ref
          .set(payload)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    // Auth Mutations
    login: (state, payload) => {
      state.auth = payload;
    },
    setUserData: (state, payload) => {
      state.userData = payload;
    },
    logout: (state) => {
      state.auth = null;
      state.userData = {};
      state.batches = {};
      state.questionFolders = {};
      state.questionCount = {};
      sessionStorage.clear();
    },

    // Profile Mutations
    setUserDataPhotoURL: (state, payload) => {
      Vue.set(state.userData, "photoURL", payload);
    },
    setUserDataOrganisationDetails: (state, payload) => {
      Vue.set(state.userData, "fullName", payload.fullName);
      Vue.set(state.userData, "phone", payload.phone);
      Vue.set(state.userData, "username", payload.username);
    },
    setUserEmail: (state, payload) => {
      Vue.set(state.userData, "email", payload);
    },

    // home/manage Mutations
    setBatches: (state, payload) => {
      state.batches = payload;
    },
    setQuestionFolders: (state, payload) => {
      state.questionFolders = payload;
    },

    // home/create Mutations
    setQuestionCount: (state, payload) => {
      state.questionCount = payload;
    },
  },
  actions: {
    // Auth Actions
    register: (context, payload) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .createUserWithEmailAndPassword(payload.email, payload.password)
          .then((cred) => {
            if (cred.user) {
              context.commit("login", cred.user);
              // create a new document for the user
              const userData = {
                email: payload.email,
                fullName: payload.fullName,
                phone: payload.phone,
                uid: cred.user.uid,
              };
              fire_store
                .collection("admins")
                .doc(cred.user.uid)
                .set(userData);

              context.commit("setUserData", userData);

              //send verification email:
              fire_auth.currentUser
                .sendEmailVerification()
                .then(function() {
                  // Email sent.
                  resolve();
                })
                .catch((error) => {
                  console.log(error);
                });

              resolve();
            } else {
              reject("Network Error");
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    login: (context, payload) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .signInWithEmailAndPassword(payload.email, payload.password)
          .then((cred) => {
            if (cred.user) {
              context.commit("login", cred.user);
              context
                .dispatch("setUserData")
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              reject("Network Error");
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    setUserData: (context) => {
      const ref = fire_store.collection("admins").doc(context.state.auth.uid);

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((res) => {
            const data = res.data();
            context.commit("setUserData", data);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logout: (context) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .signOut()
          .then(() => {
            context.commit("logout");
            resolve();
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },
    resetPassword: (context, payload) => {
      return new Promise((resolve, reject) => {
        fire_auth
          .sendPasswordResetEmail(payload)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },

    // Profile Actions
    setProfilePhoto: (context, payload) => {
      const docRef = fire_store
        .collection("admins")
        .doc(context.state.auth.uid);

      //admins/[uid]/dp.jpeg
      const storageRef = fire_storage
        .ref()
        .child(`admins/${context.state.auth.uid}/dp.jpeg`);

      return new Promise((resolve, reject) => {
        storageRef
          .putString(payload.image_data, "data_url")
          .then((snapshot) => {
            snapshot.ref.getDownloadURL().then((url) => {
              docRef
                .update({ photoURL: url })
                .then(() => {
                  context.commit("setUserDataPhotoURL", url);
                  resolve();
                })
                .catch((err) => {
                  console.log(err);
                  reject(err);
                });
            });
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    checkUsernameExists: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .where("username", "==", payload)
        .limit(1);

      return new Promise((resolve, reject) => {
        // if user has not changed his original username, then return username does NOT exist
        if (payload == context.state.userData.username) {
          resolve(false);
        } else {
          ref
            .get()
            .then((querySnapshot) => {
              resolve(!querySnapshot.empty);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    },
    submitOrganisationDetails: (context, payload) => {
      const ref = fire_store.collection("admins").doc(context.state.auth.uid);
      return new Promise((resolve, reject) => {
        context
          .dispatch("checkUsernameExists", payload.username)
          .then((res) => {
            const userNameExists = res;
            if (userNameExists) {
              reject("invalidUsername");
            } else {
              ref
                .update(payload)
                .then(() => {
                  context.commit("setUserDataOrganisationDetails", payload);
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            }
          });
      });
    },
    changeEmail: (context, payload) => {
      var user = fire_auth.currentUser;
      const ref = fire_store.collection("admins").doc(context.state.auth.uid);
      return new Promise((resolve, reject) => {
        user
          .updateEmail(payload)
          .then(function() {
            ref
              .update({ email: payload })
              .then(() => {
                user.sendEmailVerification();
                context.commit("setUserEmail", payload);
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },

    // home/create Actions
    submitQuestion: (context, payload) => {
      var batch = fire_store.batch();

      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("questions")
        .doc(payload.id);

      batch.set(ref, payload);

      const counterRef = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("meta")
        .doc("questionCounter");

      batch.set(
        counterRef,
        {
          [payload.folder]: firestore_fieldvalue.increment(1),
        },
        { merge: true }
      );

      return new Promise((resolve, reject) => {
        batch
          .commit()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    updateQuestion: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("questions")
        .doc(payload.id);

      return new Promise((resolve, reject) => {
        ref
          .set(payload)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    decrementFolderCount: (context, payload) => {
      const counterRef = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("meta")
        .doc("questionCounter");

      return new Promise((resolve, reject) => {
        counterRef
          .update({
            [payload]: firestore_fieldvalue.increment(-1),
          })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    getSingleQuestion: (context) => {
      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("questions")
        .orderBy("id", "desc")
        .limit(1);

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((snapshot) => {
            resolve(!snapshot.empty);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    submitTest: (context, payload) => {
      var payloadWithUID = payload;
      payloadWithUID.institutionUID = context.state.auth.uid;
      payloadWithUID.institutionName = context.state.userData.fullName;

      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("tests")
        .doc(payload.id);
      return new Promise((resolve, reject) => {
        ref
          .set(payloadWithUID)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },
    fetchNumberOfQuestions: (context) => {
      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("meta")
        .doc("questionCounter");

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((doc) => {
            const data = doc.data();
            context.commit("setQuestionCount", data);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // home/manage Actions
    getQuestionFolders: (context) => {
      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("meta")
        .doc("questionFolders");

      // also fetch questionCount as it is mostly needed with this function
      context.dispatch("fetchNumberOfQuestions");

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data();
              context.commit("setQuestionFolders", data);
              resolve(data);
            } else {
              resolve(false);
            }
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },
    saveQuestionFolders: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("meta")
        .doc("questionFolders");

      return new Promise((resolve, reject) => {
        ref
          .set(payload)
          .then(() => {
            context.commit("setQuestionFolders", payload);
            context.dispatch("fetchNumberOfQuestions");
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getAllQuestions: (context, payload) => {
      var ref = "";

      switch (payload.requestType) {
        case "prev":
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("questions")
            .orderBy("id", "desc")
            .endBefore(payload.doc)
            .limit(10);
          break;
        case "next":
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("questions")
            .orderBy("id", "desc")
            .startAfter(payload.doc)
            .limit(10);

          break;
        default:
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("questions")
            .orderBy("id", "desc")
            .limit(10);
      }

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((snapshot) => {
            const resData = snapshot.docs.map((doc) => doc.data());
            const res = {
              data: resData,
              firstAndLastVisible: {
                firstVisible: snapshot.docs[0],
                lastVisible: snapshot.docs[snapshot.docs.length - 1],
              },
            };
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getFolderQuestions: (context, payload) => {
      var ref = "";

      switch (payload.requestType) {
        case "prev":
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("questions")
            .where("folder", "==", payload.folder)
            .orderBy("id", "desc")
            .endBefore(payload.doc)
            .limit(10);
          break;
        case "next":
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("questions")
            .where("folder", "==", payload.folder)
            .orderBy("id", "desc")
            .startAfter(payload.doc)
            .limit(10);
          break;
        default:
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("questions")
            .where("folder", "==", payload.folder)
            .orderBy("id", "desc")
            .limit(10);
      }

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((snapshot) => {
            const resData = snapshot.docs.map((doc) => doc.data());
            const res = {
              data: resData,
              firstAndLastVisible: {
                firstVisible: snapshot.docs[0],
                lastVisible: snapshot.docs[snapshot.docs.length - 1],
              },
            };
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deleteQuestion: (context, payload) => {
      var batch = fire_store.batch();

      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("questions")
        .doc(payload.id);

      batch.delete(ref);

      const counterRef = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("meta")
        .doc("questionCounter");

      batch.set(
        counterRef,
        {
          [payload.folder]: firestore_fieldvalue.increment(-1),
        },
        { merge: true }
      );

      return new Promise((resolve, reject) => {
        batch
          .commit()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error.code);
          });
      });
    },
    getBatches: (context) => {
      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("meta")
        .doc("batches");

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data();
              context.commit("setBatches", data.batches);
              resolve(data.batches);
            } else {
              resolve(false);
            }
          })
          .catch((error) => {
            reject(error.code);
          });
      });
    },
    saveBatches: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("meta")
        .doc("batches");

      return new Promise((resolve, reject) => {
        ref
          .set(payload)
          .then(() => {
            context.commit("setBatches", payload.batches);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getAllTests: (context, payload) => {
      var ref = "";

      switch (payload.requestType) {
        case "prev":
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("tests")
            .orderBy("id", "desc")
            .endBefore(payload.doc)
            .limit(10);
          break;
        case "next":
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("tests")
            .orderBy("id", "desc")
            .startAfter(payload.doc)
            .limit(10);

          break;
        default:
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("tests")
            .orderBy("id", "desc")
            .limit(10);
      }

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((snapshot) => {
            const resData = snapshot.docs.map((doc) => doc.data());
            const res = {
              data: resData,
              firstAndLastVisible: {
                firstVisible: snapshot.docs[0],
                lastVisible: snapshot.docs[snapshot.docs.length - 1],
              },
            };
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deleteTest: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("tests")
        .doc(payload);

      return new Promise((resolve, reject) => {
        ref
          .delete()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error.code);
          });
      });
    },

    // home/view
    getAllResults: (context, payload) => {
      var ref = "";

      switch (payload.requestType) {
        case "prev":
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("tests")
            .doc(payload.testID)
            .collection("results")
            .orderBy("graded") // false comes first (add "desc" to make true first)
            .endBefore(payload.doc)
            .limit(10);
          break;
        case "next":
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("tests")
            .doc(payload.testID)
            .collection("results")
            .orderBy("graded")
            .startAfter(payload.doc)
            .limit(10);
          break;
        default:
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("tests")
            .doc(payload.testID)
            .collection("results")
            .orderBy("graded")
            .limit(10);
      }

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((snapshot) => {
            const resData = snapshot.docs.map((doc) => doc.data());
            const res = {
              data: resData,
              firstAndLastVisible: {
                firstVisible: snapshot.docs[0],
                lastVisible: snapshot.docs[snapshot.docs.length - 1],
              },
            };
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    fetchTestQuestions: (context, payload) => {
      var promises = [];
      var questionsObj = {};
      var questionsLogObj = {}; //to log which question belongs to which section

      for (var key of Object.keys(payload.selectedQuestions)) {
        questionsObj[key] = [];

        // if array: loop through array and push promise to fetch each document
        if (payload.selectedQuestions[key] instanceof Array) {
          let questionRefsArr = [];
          payload.selectedQuestions[key].forEach((id) => {
            questionRefsArr.push(
              fire_store
                .collection("admins")
                .doc(context.state.auth.uid)
                .collection("questions")
                .doc(id)
                .get()
            );
            questionsLogObj[id] = key;
          });
          promises = promises.concat(questionRefsArr);
        } else {
          // if not array, then folder: push promise query to fetch folder documents
          let folderQuery = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("questions")
            .where("folder", "==", payload.selectedQuestions[key].folderName)
            .get();

          promises.push(folderQuery);

          // log which folder belongs to what section
          questionsLogObj[payload.selectedQuestions[key].folderName] = key;
        }
      }

      var totalObjectiveQuestions = 0;

      return new Promise((resolve, reject) => {
        return Promise.all(promises)
          .then((resArr) => {
            resArr.forEach((res) => {
              if ("id" in res) {
                //is a document
                var docData = res.data();

                //questionsLogObj[docData.id] is docSection;
                questionsObj[questionsLogObj[docData.id]].push(docData);

                if (!docData.isSubjective) {
                  totalObjectiveQuestions++;
                }
              } else if (!res.empty) {
                // is a snapshot for a folder; check if snapshot is not empty
                res.docs.forEach((doc) => {
                  var docData = doc.data();
                  questionsObj[questionsLogObj[docData.folder]].push(docData);
                  if (!docData.isSubjective) {
                    totalObjectiveQuestions++;
                  }
                });
              }
            });

            resolve({ questionsObj, totalObjectiveQuestions });
          })
          .catch((error) => reject(error));
      });
    },
    gradeSheet: (context, payload) => {
      const ref = fire_store
        .collection("admins")
        .doc(context.state.auth.uid)
        .collection("tests")
        .doc(payload.testID)
        .collection("results")
        .doc(payload.result.uid);

      var finalPayload = payload.result;

      return new Promise((resolve, reject) => {
        ref
          .update(finalPayload)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error.code);
          });
      });
    },
    getAllResultsByScore: (context, payload) => {
      var ref = "";

      switch (payload.requestType) {
        case "prev":
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("tests")
            .doc(payload.testID)
            .collection("results")
            .orderBy("objectiveScore", "desc")
            .endBefore(payload.doc)
            .limit(10);
          break;
        case "next":
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("tests")
            .doc(payload.testID)
            .collection("results")
            .orderBy("objectiveScore", "desc")
            .startAfter(payload.doc)
            .limit(10);
          break;
        default:
          ref = fire_store
            .collection("admins")
            .doc(context.state.auth.uid)
            .collection("tests")
            .doc(payload.testID)
            .collection("results")
            .orderBy("objectiveScore", "desc")
            .limit(10);
      }

      return new Promise((resolve, reject) => {
        ref
          .get()
          .then((snapshot) => {
            const resData = snapshot.docs.map((doc) => doc.data());
            const res = {
              data: resData,
              firstAndLastVisible: {
                firstVisible: snapshot.docs[0],
                lastVisible: snapshot.docs[snapshot.docs.length - 1],
              },
            };
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
