#!/bin/bash

config_file="flags.json"
custom_url=$(jq -r '.custom_url' $config_file)
custom_version=$(jq -r '.custom_version' $config_file)
custom_type=$(jq -r '.custom_type' $config_file)
custom_key=$(jq -r '.custom_key' $config_file)

command="npx blueprint run --custom $custom_url --custom-version $custom_version --custom-type $custom_type --custom-key $custom_key --mnemonic $1"
$command