import Profile from './assets/images/profile.svg';
import Man from './assets/images/man.svg';
import Beard from './assets/images/beard.svg';

export const fetchUserImage = (name) => {
    switch(name) {
        case 'man':
            return Man;
        case 'profile':
            return Profile;
        case 'beard':
            return Beard;
        default:
            return Man
    }
}

export const timeSince = (date) => {

    let seconds = Math.floor((new Date() - date) / 1000);
  
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " yr";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " mon";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " m";
    }
    return Math.floor(seconds) + " s";
  }