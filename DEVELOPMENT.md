# Development

### Log [06-14-2020]
- Write feature list [Anukrat]
- Write feature tests in Gherkin [Anubis]
- [Configure AWS S3 Website @ chasebox.com](#configure-aws-s3-website-chaseboxcom) [Anubis]
- [Configure Travis CI with AWS S3](#configure-travis-ci-with-aws-s3) [Anubis]
- [Configure AWS Workmail with mail@chasebox.com](#configure-aws-workmail-with-amp109amp97amp105amp108amp64amp99amp104amp97amp115amp101amp98amp111amp120amp46amp99amp111amp109) [Anubis]
- [Configure AWS Workmail to Trigger AWS Lambda](#configure-aws-workmail-to-trigger-aws-lambda) [Anubis]
- [Configure AWS Lambda to Trigger outbound emails in AWS Workmail](#configure-aws-lambda-to-trigger-outbound-emails-in-aws-workmail) [Anubis]

##### Configure AWS S3 Website @ chasebox.com
- Add NS Records to chasebox.com in Route 53
- Create AWS S3 Bucket named with the domain name: `chasebox.com`
	- Region: `US East (N. Virginia)
	- Disable `Block all Public Access`
- Add Bucket Policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::chasebox.com/*"
        }
    ]
}
```

- Add `index.html` document to S3 Bucket
- Enable Static Website Hosting on S3 Bucket
	- Use this bucket to host a website
- Enpoint: `http://chasebox.com.s3-website-us-east-1.amazonaws.com`
- Request a new public certificate in AWS Certificate Manager
	- Add domain names: `chasebox.com` & `*.chasebox.com`
	- Use DNS Validation
- Validate SSL Certificate by clicking `Create record in Route 53`
- Wait till SSL Certificate is Issued (10-30 minutes)
- Create a new CloudFront Web Distribution
	- Origin Domain Name: `chasebox.com.s3-website-us-east-1.amazonaws.com`
	- Viewer Protocol Policy: `Redirect HTTP to HTTPS`
	- Alternate Domain Names (CNAMEs): `chasebox.com` & `www.chasebox.com
	- SSL Certificate: `Custom SSL Certificate (chasebox.com)`
	- Compress Objects Automatically: `Yes`
- Wait for CloudFront Distribution to deploy (15-40 mins)
- Add A records in Route 53 for CloudFront Distribution for `chasebox.com` & `www.chasebox.com`
	- Alias: `Yes`
	- Alias Target: `dxzhnz8buoc2z.cloudfront.net`
- Test Website @ `https://chasebox.com` & `https://www.chasebox.com`

##### Configure Travis CI with AWS S3 
- 

#### Configure AWS Workmail with mail@chasebox.com
- 

#### Configure AWS Workmail to Trigger AWS Lambda
- 

#### Configure AWS Lambda to Trigger outbound emails in AWS Workmail
- 

### Log [06-13-2020]
- Create GitHub Repository
- Add README.md
- Add CHANGELOG.md
- Add DEVELOPMENT.md
- Add CONTRIBUTING.md
- Add subfolders for project components