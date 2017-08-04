const async = require('async');
const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');
const socketClient = require('socket.io-client');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
const redis = require('redis').createClient({host:'172.23.238.134', port: 6379});

let allCircles, allMailboxes, allMailboxesWithCircleMailboxes = [];
let allActivities = [];
let allSockets = [];
let c1,c2,c3,c4,c5,m1,m2,m3,m4,m5,m6,m7,m8,m9;

const host = 'http://localhost:4000';
const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2lyY2xlczphbGwiLCJmb2xsb3dzOmFsbCIsIm1haWxib3g6YWxsIl0sImlhdCI6MTUwMDU3MDYyMX0.YqHdtxTPeq5UoT9yUhQw9gziURvdHAfaiALOwlhGCTg`;


/*describe('Messages posted to circle', function() {
	this.timeout(4000);
	it('gets delivered to circle mailbox immediately', (done) => {
		chai.request(host)
		.post('/circle')
		.set('Authorization', token)
		.end((err, res) => {
			if (err) { done(err); return; }
			res.should.have.status(201);
			expect(res.body).to.be.an('object').to.have.property('circleId');
			expect(res.body).to.be.an('object').to.have.property('mailboxId');
			expect(res.body).to.be.an('object').to.have.property('createdOn');
			let circleId = res.body.circleId;
			let circleMailboxId = res.body.mailboxId;
			if(!circleId || !circleMailboxId) { done(); return;}
			chai.request(host)
			.post(`/circle/${circleId}/activity`)
			.set('Authorization', token)
			.send({ link: 'www.facebook.com' })
			.end((err, res) => {
				if (err) { done(err); return; }
				res.should.have.status(201);
				expect(res.body).to.be.an('object').to.have.property('payload');
				expect(res.body.payload).to.be.an('object').to.have.property('link');
				setTimeout(function(){
					chai.request(host)
					.get(`/mailbox/getallactivities/${circleMailboxId}`)
					.set('Authorization', token)
					.end((err, res) => {
						if (err) { done(err); return; }
						res.should.have.status(201);
						expect(res.body).to.be.an('object').to.have.property('items');
						expect(res.body).to.be.an('object').to.have.property('totalItems');
						expect(res.body).to.be.an('object').to.have.property('first');
						expect(res.body).to.be.an('object').to.have.property('last');
						expect(res.body.totalItems).to.equal(1);
						done();
					});
				}, 3000);
			});
		});
	});
});

describe('Messages posted to mailbox', function() {
	it('gets delivered to mailbox immediately', (done) => {
		chai.request(host)
		.post('/mailbox')
		.end((err, res) => {
			if (err) { done(err); return; }
			res.should.have.status(201);
			expect(res.body).to.be.an('object').to.have.property('mailboxId');
			let mailboxId = res.body.mailboxId;
			if(!mailboxId) { done(); return;}
			chai.request(host)
			.post(`/mailbox/${mailboxId}/activitytomailbox`)
			.set('Authorization', token)
			.send({ link: 'www.facebook.com' })
			.end((err, res) => {
				if (err) { done(err); return; }
				res.should.have.status(201);
				expect(res.body).to.be.an('object').to.have.property('payload');
				expect(res.body.payload).to.be.an('object').to.have.property('link');
				chai.request(host)
				.get(`/mailbox/getallactivities/${mailboxId}`)
				.set('Authorization', token)
				.end((err, res) => {
					if (err) { done(err); return; }
					res.should.have.status(201);
					expect(res.body).to.be.an('object').to.have.property('items');
					expect(res.body).to.be.an('object').to.have.property('totalItems');
					expect(res.body).to.be.an('object').to.have.property('first');
					expect(res.body).to.be.an('object').to.have.property('last');
					expect(res.body.totalItems).to.equal(1);
					done();
				});
			});
		});
	});
})*/

describe('Messages posted to circle', function() {
	this.timeout(30000);
	before((done) => {

		createCircles(5, (error, result) => {
			if(error) { done(error); return;}
			allCircles = _.map(result, 'circleId');
			allMailboxesWithCircleMailboxes = _.map(result, 'mailboxId');

			createMailboxes(9, (error, result) => {
				if(error) { done(error); return;}
				allMailboxes = _.map(result, 'mailboxId');
				allMailboxesWithCircleMailboxes.concat(_.map(result, 'mailboxId'));

				c1 = allCircles[0];
				c2 = allCircles[1];
				c3 = allCircles[2];
				c4 = allCircles[3];
				c5 = allCircles[4];

				m1 = allMailboxes[0];
				m2 = allMailboxes[1];
				m3 = allMailboxes[2];
				m4 = allMailboxes[3];
				m5 = allMailboxes[4];
				m6 = allMailboxes[5];
				m7 = allMailboxes[6];
				m8 = allMailboxes[7];
				m9 = allMailboxes[8];

				done();
			});
		});
	});

	beforeEach((done) => {
		allActivities = [];
		allSockets = [];
		done();
	});

	/*describe('All non-following users, whether online or offline', function(){
		before((done) => {
			setMailboxesOnline([m1, m2, m3, m5, m8, m9], (error, result) => {});
			done();
		});

		it('will not receive the message', (done) => {
			setTimeout(function(){
				pushActivitiesToCircles([c1, c2, c3, c4, c5], 1000, (err, result) => {
					if(err) { done(err); return;}
				})
			}, 3000);

			setTimeout(function(){
				getActivitiesOfMailboxes([m1, m2, m3, m4, m5, m6, m7, m8, m9], (err, result) => {
					console.log([m1, m2, m3, m4, m5, m6, m7, m8, m9]);
					console.log(allActivities);
					console.log(allSockets);
					if(err) { done(err); return;}
					expect(allActivities.length).to.equal(0);
					expect(_.filter(allSockets, { mailboxId: m1})[0].activities.length).to.equal(0);
					expect(_.filter(allSockets, { mailboxId: m2})[0].activities.length).to.equal(0);
					expect(_.filter(allSockets, { mailboxId: m3})[0].activities.length).to.equal(0);
					expect(_.filter(allSockets, { mailboxId: m5})[0].activities.length).to.equal(0);
					expect(_.filter(allSockets, { mailboxId: m8})[0].activities.length).to.equal(0);
					expect(_.filter(allSockets, { mailboxId: m9})[0].activities.length).to.equal(0);
					done();
				})
			}, 8000);
		});

		after((done) => {
			setMailboxesOffline([m1, m2, m3, m5, m8, m9], (error, result) => {});
			done();
		})
	});
*/
	describe('All following users who are online', function(){
		before((done) => {

			followCircles([c1], [m1], (error, result) => {});
			/*followCircles([c3], [m3, m4], (error, result) => {});
			followCircles([c4], [m2, m3, m5], (error, result) => {});
			followCircles([c5], [m6, m7, m8], (error, result) => {});*/

			setMailboxesOnline([m1], (error, result) => {});

			done();
		});

		it('will receive message immediately in mailbox and as push notifications', (done) => {
			setTimeout(function(){
				pushActivitiesToCircles([c1], 1000, (err, result) => {
					if(err) { done(err); return;}
				})
			}, 3000);

			setTimeout(function(){
				getActivitiesOfMailboxes([m1], (err, result) => {
					console.log([m1]);
					console.log(allActivities);
					console.log(_.filter(allSockets, { mailboxId: m1})[0].activities.length);
					if(err) { done(err); return;}
					expect(_.filter(allSockets, { mailboxId: m1})[0].activities.length).to.equal(1000);
					expect(_.filter(allActivities, { mailboxId: m1}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m1})[0].activities.length).to.equal(1000);
	
		/*			expect(_.filter(allActivities, { mailboxId: m2}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m3}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m3})[0].activities.length).to.equal(3000);
					expect(_.filter(allSockets, { mailboxId: m3})[0].activities.length).to.equal(3000);
					expect(_.filter(allActivities, { mailboxId: m4}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m5}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m5})[0].activities.length).to.equal(1000);
					expect(_.filter(allSockets, { mailboxId: m5})[0].activities.length).to.equal(1000);
					expect(_.filter(allActivities, { mailboxId: m6}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m7}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m8}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m8})[0].activities.length).to.equal(1000);
					expect(_.filter(allSockets, { mailboxId: m8})[0].activities.length).to.equal(1000);
					expect(_.filter(allActivities, { mailboxId: m9}).length).to.equal(0);*/
					done();
				})
			}, 25000);
		});
	});

	/*describe('All following users who are online and they goes offline', function(){
		before((done) => {

			setMailboxesOffline([m1, m3, m5, m8, m9], (error, result) => {});

			done();
		});

		it('will stop receiving messages', (done) => {
			setTimeout(function(){
				pushActivitiesToCircles([c1, c2, c3, c4, c5], 1000, (err, result) => {
					if(err) { done(err); return;}
				})
			}, 3000);

			setTimeout(function(){
				getActivitiesOfMailboxes([m1, m2, m3, m4, m5, m6, m7, m8, m9], (err, result) => {
					console.log([m1, m2, m3, m4, m5, m6, m7, m8, m9]);
					console.log(allActivities);
					if(err) { done(err); return;}
					expect(allSockets,length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m1}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m1})[0].activities.length).to.equal(1000);
					expect(_.filter(allActivities, { mailboxId: m2}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m3}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m3})[0].activities.length).to.equal(3000);
					expect(_.filter(allActivities, { mailboxId: m4}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m5}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m5})[0].activities.length).to.equal(1000);
					expect(_.filter(allActivities, { mailboxId: m6}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m7}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m8}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m8})[0].activities.length).to.equal(1000);
					expect(_.filter(allActivities, { mailboxId: m9}).length).to.equal(0);
					done();
				})
			}, 8000);
		});
	});

	describe('All following users who are not online and they comes online', function(){
		before((done) => {

			setMailboxesOnline([m1, m3, m5, m8, m9], (error, result) => {});

			done();
		});

		it('will receive previous messages', (done) => {
			setTimeout(function(){
				pushActivitiesToCircles([c1, c2, c3, c4, c5], 1000, (err, result) => {
					if(err) { done(err); return;}
				})
			}, 3000);

			setTimeout(function(){
				getActivitiesOfMailboxes([m1, m2, m3, m4, m5, m6, m7, m8, m9], (err, result) => {
					console.log([m1, m2, m3, m4, m5, m6, m7, m8, m9]);
					console.log(allActivities);
					if(err) { done(err); return;}
					expect(_.filter(allActivities, { mailboxId: m1}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m1})[0].activities.length).to.equal(3000);
					expect(_.filter(allSockets, { mailboxId: m1})[0].activities.length).to.equal(1000);
					expect(_.filter(allActivities, { mailboxId: m2}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m3}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m3})[0].activities.length).to.equal(9000);
					expect(_.filter(allSockets, { mailboxId: m3})[0].activities.length).to.equal(3000);
					expect(_.filter(allActivities, { mailboxId: m4}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m5}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m5})[0].activities.length).to.equal(3000);
					expect(_.filter(allSockets, { mailboxId: m5})[0].activities.length).to.equal(1000);
					expect(_.filter(allActivities, { mailboxId: m6}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m7}).length).to.equal(0);
					expect(_.filter(allActivities, { mailboxId: m8}).length).to.equal(1);
					expect(_.filter(allActivities, { mailboxId: m8})[0].activities.length).to.equal(3000);
					expect(_.filter(allSockets, { mailboxId: m8})[0].activities.length).to.equal(1000);
					expect(_.filter(allActivities, { mailboxId: m9}).length).to.equal(0);
					done();
				})
			}, 8000);
		});
	});
*/
	afterEach((done) => {
		_.each(allSockets, function(conn, index){
			conn.socket.removeAllListeners();
			conn.socket.disconnect();
		});
		done();
	});

	after((done) => {
		deleteCircles([c1,c2,c3,c4,c5], (error, result) => {
			if(error) { done(error); return;}
		});
		deleteMailboxes([m1,m2,m3,m4,m5,m6,m7,m8,m9], (error, result) => {
			if(error) { done(error); return;}
		});
		done();
	});
});

function createCircles(circleCount, callback){
	var tasks = [];
	for(let i = 0; i < circleCount; i += 1){
		tasks.push(createOneCircle);
	}
	async.parallel(
		tasks,
		function(error, result){
			if(error) { callback(error); return;}
			else{ callback(null, result); return;}
		}
		);
}

function createOneCircle(callback){
	chai.request(host)
	.post('/circle')
	.set('Authorization', token)
	.end((err, res) => {
		if (err) { callback(err); return; }
		else { callback(null, res.body); return; }
	});
}

function deleteCircles(circles, callback){
	var tasks = [];
	_.each(circles, function(circle, index){
		tasks.push(deleteOneCircle.bind(null, circle));
	});
	async.parallel(
		tasks,
		function(error, result){
			if(error) { callback(error); return;}
			else{ callback(); return;}
		}
		);
}

function deleteOneCircle(circleId, callback){
	chai.request(host)
	.del(`/circle/${circleId}`)
	.set('Authorization', token)
	.end((err, res) => {
		if (err) { callback(err); return; }
		else { callback(); return; }
	});
}

function createMailboxes(mailboxCount, callback){
	var tasks = [];
	for(let i = 0; i < mailboxCount; i += 1){
		tasks.push(createOneMailbox);
	}
	async.parallel(
		tasks,
		function(error, result){
			if(error) { return callback(error); return;}
			else{ return callback(null, result); return;}
		}
		);
}

function createOneMailbox(callback){
	chai.request(host)
	.post('/mailbox')
	.set('Authorization', token)
	.end((err, res) => {
		if (err) { callback(err); return; }
		else { callback(null, res.body); return; }
	});
}

function deleteMailboxes(mailboxes, callback){
	var tasks = [];
	_.each(mailboxes, function(mailbox, index){
		tasks.push(deleteOneMailbox.bind(null, mailbox));
	});
	async.parallel(
		tasks,
		function(error, result){
			if(error) { callback(error); return;}
			else{ callback(); return;}
		}
		);
}

function deleteOneMailbox(mailboxId, callback){
	chai.request(host)
	.del(`/mailbox/${mailboxId}`)
	.set('Authorization', token)
	.end((err, res) => {
		if (err) { callback(err); return; }
		else { callback(); return; }
	});
}

function pushActivitiesToCircles(circles, activityCount, callback){
	var tasks = [];
	_.each(circles, function(circle, index){
		for(let i = 0; i < activityCount; i += 1){
			tasks.push(pushOneActivityToCircle.bind(null, circle, i));
		}
	});
	async.series(
		tasks,
		function(error, result){
			if(error) { return callback(error); return;}
			else{ return callback(); return;}
		}
		);
}

function pushOneActivityToCircle(circleId, msgNumber, callback){
	chai.request(host)
	.post(`/circle/${circleId}/activity`)
	.set('Authorization', token)
	.send({ msgNum: msgNumber, circleId: circleId })
	.end((err, res) => {
		if (err) { callback(err); return; }
		else { callback(); return; }
	});
}

function getActivitiesOfMailboxes(mailboxes, callback){
	var tasks = [];
	_.each(mailboxes, function(mailbox, index){
		tasks.push(getActivitiesOfOneMailbox.bind(null, mailbox));
	});
	async.parallel(
		tasks,
		function(error, result){
			if(error) { return callback(error); return;}
			else{ return callback(); return;}
		}
		);
}

function getActivitiesOfOneMailbox(mailboxId, callback){
	chai.request(host)
	.get(`/mailbox/getallactivities/${mailboxId}?limit=-1`)
	.set('Authorization', token)
	.end((err, res) => {
		if (err) { callback(err); return; }
		else {
			if(res && res.body && res.body.totalItems > 0){
				let mailbox = _.filter(allActivities, { mailboxId: mailboxId});
				if(!mailbox  || mailbox.length == 0) { 
					allActivities.push({mailboxId: mailboxId, activities: []});
				}
				var thisMailboxActivities = _.filter(allActivities, { mailboxId: mailboxId})[0].activities;
				thisMailboxActivities = thisMailboxActivities.concat(res.body.items);
				_.filter(allActivities, { mailboxId: mailboxId})[0].activities = thisMailboxActivities;
			}
			callback (); return; 
		}
	});
}

function followCircles(circles, mailboxes, callback){
	var tasks = [];
	_.each(circles, function(circle, index){
		_.each(mailboxes, function(mailbox, index){
			tasks.push(oneFollow.bind(null, circle, mailbox));
		})
	});
	async.parallel(
		tasks,
		function(error, result){
			if(error) { return callback(error); return;}
			else{ return callback(); return;}
		}
		);
}

function oneFollow(circleId, mailboxId, callback){
	chai.request(host)
	.post(`/mailbox/${mailboxId}/circle/${circleId}`)
	.set('Authorization', token)
	.end((err, res) => {
		if (err) { callback(err); return; }
		else { callback(); return; }
	});
}

function unfollowCircles(circles, mailboxes, callback){
	var tasks = [];
	_.each(circles, function(circle, index){
		_.each(mailboxes, function(mailbox, index){
			tasks.push(oneUnfollow.bind(null, circle, mailbox));
		})
	});
	async.parallel(
		tasks,
		function(error, result){
			if(error) { return callback(error); return;}
			else{ return callback(); return;}
		}
		);
}

function oneUnfollow(circleId, mailboxId, callback){
	chai.request(host)
	.del(`/mailbox/${mailboxId}/circle/${circleId}`)
	.set('Authorization', token)
	.end((err, res) => {
		if (err) { callback(err); return; }
		else { callback(); return; }
	});
}

function setMailboxesOnline(mailboxes, callback){
	_.each(mailboxes, function(mailbox, index){
		let socket = socketClient(host);
		socket.on('connect', function(){
			allSockets.push({mailboxId: mailbox, socket: socket, activities: []});
		});
		socket.emit('authorize', token);
		socket.emit('startListeningToMailbox', { mid : mailbox });
		socket.on('newActivity', (activity) => {
			_.filter(allSockets, { mailboxId: mailbox})[0].activities.push(activity);
		})
	})
}

function setMailboxesOffline(mailboxes, callback){
	_.each(allSockets, function(conn, index){
		if(mailboxes.indexOf(conn.mailboxId) > -1){
			conn.socket.emit('stopListeningToMailbox', { mid : conn.mailboxId });	
			conn.socket.removeAllListeners();
			conn.socket.disconnect();
		}
	})
}