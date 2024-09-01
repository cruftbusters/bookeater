#!/usr/bin/env zsh

stack_name=bookeater

action=create-stack

if aws cloudformation describe-stacks --stack-name $stack_name > /dev/null 2>&1 ; then
  action=update-stack
fi

aws cloudformation $action --stack-name $stack_name --template-body file://.aws/cloudformation.yml
