let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe('Circle API', function() {

	before((done) => {
		chai.request('http://localhost:4000')
		.post('/multiplexer/dev_m1')
		.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2lyY2xlczphbGwiLCJmb2xsb3dzOmFsbCIsIm1haWxib3g6YWxsIl0sImlhdCI6MTUwMDU3MDYyMX0.YqHdtxTPeq5UoT9yUhQw9gziURvdHAfaiALOwlhGCTg`)
		.end((err, res) => {
			res.should.have.status(201);
			done();
		});
	});


	it('circles mailbox gets all the messages immediately', (done) => {
		chai.request('http://localhost:4000')
		.post('/circle')
		.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2lyY2xlczphbGwiLCJmb2xsb3dzOmFsbCIsIm1haWxib3g6YWxsIl0sImlhdCI6MTUwMDU3MDYyMX0.YqHdtxTPeq5UoT9yUhQw9gziURvdHAfaiALOwlhGCTg`)
		.end((err, res) => {
			res.should.have.status(201);
			expect(res.body).to.be.an('object').to.have.property('circleId');
			expect(res.body).to.be.an('object').to.have.property('mailboxId');
			expect(res.body).to.be.an('object').to.have.property('createdOn');

			let circleId = res.body.circleId;
			let circleMailboxId = res.body.mailboxId;
			if(!circleId || !circleMailboxId) { done(); return;}
			chai.request('http://localhost:4000')
			.post(`/circle/${circleId}/activity`)
			.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2lyY2xlczphbGwiLCJmb2xsb3dzOmFsbCIsIm1haWxib3g6YWxsIl0sImlhdCI6MTUwMDU3MDYyMX0.YqHdtxTPeq5UoT9yUhQw9gziURvdHAfaiALOwlhGCTg`)
			.send({ link: 'www.facebook.com' })
			.end((err, res) => {
				console.log(err);
				console.log(res);
				if (err) { done(err); return; }
				res.should.have.status(201);
				expect(res.body).to.be.an('object').to.have.property('payload');
				expect(res.body.payload).to.be.an('object').to.have.property('link');
				chai.request('http://localhost:4000')
				.get(`/mailbox/getallactivities/${circleMailboxId}`)
				.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2lyY2xlczphbGwiLCJmb2xsb3dzOmFsbCIsIm1haWxib3g6YWxsIl0sImlhdCI6MTUwMDU3MDYyMX0.YqHdtxTPeq5UoT9yUhQw9gziURvdHAfaiALOwlhGCTg`)
				.end((err, res) => {
					console.log(res.body);
					console.log(err);
					if (err) { done(err); return; }
					res.should.have.status(201);
					expect(res.body).to.be.an('object').to.have.property('items');
					expect(res.body).to.be.an('object').to.have.property('totalItems');
					expect(res.body).to.be.an('object').to.have.property('first');
					expect(res.body).to.be.an('object').to.have.property('last');
					done();
				});
			});
		});
	});
});