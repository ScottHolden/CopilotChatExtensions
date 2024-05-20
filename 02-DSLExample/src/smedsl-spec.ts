export const Specification = `
# Stock Movement Emoji DSL (SME-DSL) Specification
## Overview
The Stock Movement Emoji Domain-Specific Language (SME-DSL) is designed to describe the stock movement activities within a store using a sequence of emojis. Each emoji represents a specific action or item relevant to the stock movement process.
Encoding
All SME-DSL payloads must be encoded in UTF-8 to ensure proper representation of emojis across different platforms and systems. Payloads that are not UTF-8 encoded will be rejected.

## Elements
Actions
🏃‍♂️ - Move item
🚚 - Receive item
📦 - Pack item
🗑️ - Dispose item
✅ - Confirm action
❌ - Cancel action
Locations
🏪 - Store
📤 - Outbound area
📥 - Inbound area
🗄️ - Storage area
Items
 Items are represented by generic emojis, which must be predefined in a dictionary accompanying the DSL payload file.

Example:
🍎 - Apple
🥛 - Milk
📱 - Smartphone

Quantities
Numbers are represented by ASCII number 0 - 9.

Timestamp
The clock emoji (🕒) followed by a time in the format HHMM, using the number emojis.

## Multi-Action Payloads
Multiple actions can be chained together using a sequence of emojis. Each action is separated by a space.
Example:
🚚 🍎5 🏪 - Receive 5 apples at the store.
🏃‍♂️ 📱1 🗄️ 📤 - Move 1 smartphone from storage to outbound area.

## Validation

All SME-DSL payloads must be validated for:
- Correct sequence of emojis (actions must precede items and quantities).
- Valid location and item references based on the accompanying dictionary.
- Timestamps, if present, must be valid according to the 24-hour clock format.


## Hashing

Each SME-DSL payload must be hashed using SHA-256 to ensure integrity. The hash must be appended to the payload as a separate text string.
Security
All payload files must be transmitted over secure channels (e.g., HTTPS, SFTP).
Access to the SME-DSL system must require authentication.
Payloads must be signed with a digital signature to prevent tampering.
Syntax Guide
 

Each action, item, and location is represented by a specific emoji.
A quantity is represented by a sequence of numbers (e.g., 25 for 25).
A timestamp is represented by the clock emoji followed by a time in HHMM format.
Spaces separate individual actions within a multi-action payload.
Each payload must be hashed and the hash must be appended to the payload.
All payloads must be UTF-8 encoded.
Example Payload
 


🚚 🍎5 🏪 ✅ 🕒1230  
🏃‍♂️ 🥛3 🏪 📤 ✅ 🕒1300  
 
Hash (SHA-256): c7a229cf2f008a77f5a4d3fdb2c6b9feff35b956840dbf29d4d9a2e6e6a505f2

This payload describes receiving 5 apples at the store and confirming the action at 12:30, followed by moving 3 milk cartons from the store to the outbound area and confirming the action at 13:00.
`;