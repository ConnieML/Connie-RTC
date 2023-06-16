provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     = "eu-west-2"
}

resource "aws_dynamodb_table" "my_first_table" {
  name          = "connie_table"
  billing_mode   = "PROVISIONED"
  read_capacity  = 10
  write_capacity = 10
  hash_key = "agent-id"

  attribute {
    name = "agent-id"
    type = "S"
  }

  attribute {
    name = "supervisor"
    type = "S"
  }

  attribute {
    name = "notes"
    type = "S"
  }

  global_secondary_index {
    name               = "supervisor-index"
    hash_key           = "supervisor"
    projection_type    = "ALL"
    read_capacity      = 10
    write_capacity     = 10
  }

  global_secondary_index {
    name               = "notes-index"
    hash_key           = "notes"
    projection_type    = "ALL"
    read_capacity      = 10
    write_capacity     = 10
  }

   tags = {
    environment       = "connie_table"
  }
}

