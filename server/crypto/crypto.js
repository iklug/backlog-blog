

//public key cryptography
// 1. encrypt data - encrypt with public key, decrypt with private key
// 2. verify identities - encrypt with private key, decrypt with public key. 

//assymetric and symmetric crypto -- asymm has 2 keys, public and private
//symmetric has a single private key -- and it's usually used for sending data over public channels

// like decoding a secret note with a cypher -- you need to make sure to protect the secret key or else
//anyone is able to decode the message

//1. encrypt data - think about padlock and key. padlock is given to another person who owns the key 
//padlock is the public key, private key is the key owned by a different person. 

//2. is a little more complicated and involves math 

//trap door function - deterministic, one way, large number space, small enough to go over HTTP
//converts data to a unique string, but can't turn it back into data

//elliptic curve cryptography - mathematically links the private and public keys. its a trap door function
//we can share the public key with anyone, but they'll never be able to figure out private key. 
//this allows us to -- encrypt(someMessage, public_key) || decrypt(someMessage, private_key) -- for data
//and encrypt(someMessage, private_key) || decrypt(someMessage, public_key) -- id verification

