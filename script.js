import http from 'k6/http';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
 let res= http.get('http://localhost:5000/sta/subject-stats');
 console.log(res.status)
}