// File generated by FlutterFire CLI.
// ignore_for_file: lines_longer_than_80_chars, avoid_classes_with_only_static_members
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyD2NNpUFGt88AKCKOjZgH3j9af4KzafAh8',
    appId: '1:884762562507:web:94bb5b1bf4adc0ae04304e',
    messagingSenderId: '884762562507',
    projectId: 'fete-du-volley',
    authDomain: 'fete-du-volley.firebaseapp.com',
    storageBucket: 'fete-du-volley.appspot.com',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyDg84hDWrB4ad5h5wJppHmhHwVej07SROM',
    appId: '1:884762562507:android:c83513ed770d844704304e',
    messagingSenderId: '884762562507',
    projectId: 'fete-du-volley',
    storageBucket: 'fete-du-volley.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyBxvxt_lIXlskt0OaXrJlS3kU3CnWZLiNA',
    appId: '1:884762562507:ios:9b84cad29daf376504304e',
    messagingSenderId: '884762562507',
    projectId: 'fete-du-volley',
    storageBucket: 'fete-du-volley.appspot.com',
    androidClientId: '884762562507-0gqi90f7omk130fkm22l0eavd71ot2q6.apps.googleusercontent.com',
    iosClientId: '884762562507-5f6mgcrh222q57uih6ra11b7tk5s44mr.apps.googleusercontent.com',
    iosBundleId: 'com.ipiccie.ciofvSpectateur',
  );
}
