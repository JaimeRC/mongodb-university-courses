# Chapter 1: Security Concepts

## 1.1 Security Concepts: CIA

### Quiz

Problem:

You are performing an upgrade and need to make sure your data can still be accessed during the upgrade process.

Which of the following pillars of security apply to this reruirement?

__Choose the best answer:__

- [x] Availability
- [ ] Confidentiality
- [ ] Integrity
- [ ] Accountability

***See detailed answer***

- ___Availability___

This is correct. Availability ensuring your data is always available.

- ___Confidentiality___

This is incorrect. Confidentiality is keeping your data private

- ___Integrity___

This is incorrect. Integrity ensuring your data is as it should be

## 1.2 Security Concepts: AAA

### Quiz

Problem:

We have just gone live with a new banking app. There is a regulatory requirement to track user actions on the accounts collection.

Which of the following Atlas Security features should you use?

__Choose the best answer:__

- [x] Auditing
- [ ] Authorization
- [ ] IP Whitelisting
- [ ] Authentication
- [ ] TLS

***See detailed answer***

- ___Auditing___

This is correct. Auditing is used to record user actions on the database.

- ___Authorization___

This is incorrect. Authorization, is the process that controls how an identity, after being validated, can perform actions that have been granted to them.

- ___IP Whitelisting___

This is incorrect. The IP whitelist specifies which client IPs are allowed to connect to your cluster.

- ___Authentication___

This is incorrect. Authentication is the process of proving an entity is who they claim to be.

- ___TLS___

This is incorrect. TLS stands for transport layer security. This is encryption over the wire.


## 1.3 Data Flow Diagram

### Quiz

Problem:

You are a user authenticating to your Atlas cluster . At what point are IP whitelist checks performed?

__Choose the best answer:__

- [ ] After authenticating with the database.
- [x] At the Atlas Gateway prior to being forwarded to the cluster.
- [ ] During the authorization step when checking roles.
- [ ] Prior to the database responding to the operation.

***See detailed answer***

- ___After authenticating with the database___
  
This is correct. Your IP will be checked against the whitelist before your request is forwarded to the Atlas cluster.

- ___At the Atlas Gateway prior to being forwarded to the cluster___

This is incorrect. You will need to pass throuigh the IP whitelist before you can authenticate to the database.

- ___During the authorization step when checking roles___

This is incorrect. You're IP would need to pass the whitelisty to get to the authorization step.

- ___Prior to the database responding to the operation___

This is incorrect. If your IP is not in the whitelist. The database will not recieve your request.

## 1.4 Network Access Control

### Quiz

Problem:

You have a temporary contractor who is working from home. They have no access to the VPN and will finish their contract in a week.

Which Atlas network security feature would ensure that they only have access to your Atlas cluster until their contract is up?

__Choose the best answer:__

- [x] Temporary IP whitelist entry.
- [ ] Auditing
- [ ] VPC Peering
- [ ] Encryption at rest
- [ ] TLS

***See detailed answer***

___Atlas supports temporarily whitelisting CIDR ranges.___

This is correct.

Atlas allows you to add a CIDR range to your whitelist and specify a time limit on the entry. After which, the entry will be deleted.

## 1.5 User Management

### Quiz

You are tasked with designing the authentication mechanism for your department.

The authentication must be external to Atlas.

Which of the following authentication mechanisms should you consider?

__Choose the best answer:__

- [ ] SCRAM256
- [x] X509
- [x] LDAP
- [ ] Email and Password

***See detailed answer***

The correct answer is none of the above. You should never access the data files directly.

## 1.6 Encryption

### Lecture Instructions

Atlas now also has Client Side Field Level Encryption. You can read more about this in our documentation.

You can also use the [documentation](https://docs.mongodb.com/drivers/security/client-side-field-level-encryption-guide) for reference.

### Quiz

There is a reguatory requirement in your industry that states, you need to have control over the keys used to encrypt your data.

How can you achieve this in Atlas?

__Choose the best answer:__

- [x] Add your own key management server in the Atlas UI.
- [ ] TLS
- [ ] AES-256
- [ ] Call support and have them provide your keys.

***See detailed answer***

- ___Add your own key management server in the Atlas UI.___

This is correct. Atlas allowes you to "bring your own key server" so that you have total control over the keys used to encrypt your data.

- ___TLS___

This is incorrect. TLS stands for Transport Layer Security. All data in Atlas is encrypted over the wire by default.

- ___AES-256___

This is incorrect. All data in Atlas is encrypted at rest using AES-256. If you do not use your own key management server you cannot access the keys used to encrypt this data.

- ___Call support and have them provide your keys.___

This is incorrect. Support will never give access to encryption keys.


## 1.7 Logging

### Quiz

You are tasked with setting up auditing for your new Atlas cluster. One of the requirements is that you log all authentication events for a temporary consultant mike.

Which of the following audit filters would achieve this?

__Choose the best answer:__

- [x] `{
  "atype": "authenticate",
  "param": {
  "user": "mike",
  "db": "admin",
  "mechanism": "SCRAM-SHA-1"
  }
  }`
- [x] `{
  "atype": "authCheck",
  "param.command": {
  "$in": [
  "insert",
  "update",
  "delete"
  ]
  }
  }`
- [x] `{
  "$or": [
  { "users": [] },
  { "atype": "authenticate" }
  ]
  }`
- [ ] `{
  "atype": "authenticate",
  "param": {
  "user": "anyuser",
  "db": "admin",
  "mechanism": "SCRAM-SHA-1"
  }
  }`

***See detailed answer***

- `{ "atype": "authenticate", "param": { "user": "mike", "db": "admin", "mechanism": "SCRAM-SHA-1" } }`

This is correct. This filter will only log authentication events from the specific user mike.

- `{ "$or": [ { "users": [] }, { "atype": "authenticate" } ] }`

This is correct. This filter, while not specifically filtering out Mike's events this audit filter will log all authentication events so will captures mike's events too.

- `{ "atype": "authenticate", "param": { "user": "anyuser", "db": "admin", "mechanism": "SCRAM-SHA-1" } }`

This is incorrect. This filter will only catch authentication events from the user names anyuser.


## 1.8 Atlas Compliance

### Quiz

You are a hospital and you are deploying a new application to store patients medical records. You are going to use MongoDB Atlas but need to be sure you are compliant with data protection laws.

Which of the following standards ensures you are compliant with protecting patients medical data records in the united states?

__Choose the best answer:__

- [x] HIPPA
- [ ] GDPR
- [ ] SOC2
- [ ] FIPS

***See detailed answer***

- ___HIPPA___

This is correct. HIPAA stands for the Health Insurance Portability and Accountability Act. This is the security standard which needs to be implemented by any entity storing patient's medical data.

- ___GDPR___

This is incorrect. The General Data Protection Regulation (or GDPR) a regulation in EU law on data protection and privacy for all individuals within the European Union and the European Economic Area.

- ___SOC2__

This is incorrect. SOC, which is an acronym for Service Organization Controls. The Service Organization Controls (SOC) framework established a standard for controls that safeguard the confidentiality and privacy of information stored and processed in the cloud.

- ___FIPS___

This is incorrect. Federal Information Processing Standards (FIPS) are publicly announced standards developed by the National Institute of Standards and Technology for use in computer systems by non-military American government agencies and government contractors.


## 1.9 VPC Peering

### Quiz

Which of the following are true in relation to VPC peering?

__Choose the best answer:__

- [x] A VPC peering connection is a networking connection between two VPCs.
- [ ] Within a VPC all hosts must communicate using public IPs
- [x] You must have a VPC configured in your Cloud Provider before you create a peering connection.
- [ ] VPCs must be open to the internet.

***See detailed answer***

- ___VPC peering connection is a networking connection between two VPCs.___

This is correct. A peering connection is expanding your network boundry to include two VPCs.

- ___Within a VPC all hosts must communicate using public IPs___

This is incorrect. All VPC hosts can communicate using either public or private IPs.

- ___You must have a VPC configured in your Cloud Provider before you create a peering connection.___

This is correct. We cannot set up a peered connection without having two VOCs to peer.

- ___VPCs must be open to the internet.___

This is incorrect. Your VPC does not need to be open tyo the public internet. Traffic into your VPC should be limited to only essential network traffic.


## Lab - Configure VPC Peering

### Problem

Using the steps outlined in the previous video. Configure VPC peering on your cluster.

You can also use the documentation for reference.

Using a host inside your VPC, issue the following command against one of your Atlas cluster nodes:

    host <your atlas node hostname>

Which of the following is true of the host output you ran from inside your VPC?

__Choose the best answer:__

- [ ] It did not show any private IPs.
- [ ] It didn't return any values
- [ ] It returned an error stating that the host could not be resolved.
- [x] It showed a private IP
  
***See detailed answer***

If you configured VPC peering correctly, you should see that the hostname is resolving to a private ip. A private IP will be in the following format 10.x.x.x
