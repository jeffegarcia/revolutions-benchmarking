import csv
import getopt
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import boto3

# Remove 1st argument from the
# list of command line arguments
argumentList = sys.argv[1:]

# Options
OPTIONS = "t:i:o:e:f:s:"
# Long options
LONG_OPTIONS = ["Test=", "Instance=","OS=","Feature rate=", "File=", "Start="]

""" 
# Name of csv file
FILENAME = "aws_metrics.csv"
# Name of the test
TESTNAME = "GeoEvent_HttpReceiver"
# Type of AWS instance
INSTANCE_TYPE = "m4.xlarge"
# Feature rate of the test
FEATURE_RATE = 200
# Operating system of the instance
OS = "RHEL 9.3" 
TEST_START = datetime.now(timezone.utc) - timedelta(seconds = 600)

Example: poetry run python get_cloudwatch.py -t geojson_test -i m4.xlarge -o Linux -e 200 -f aws_metrics.csv -s 1718224462
"""
try:
    # Parsing argument
    arguments, values = getopt.getopt(argumentList, OPTIONS, LONG_OPTIONS)
    # checking each argument
    for currentArgument, currentValue in arguments:
        if currentArgument in ("-t", "--Test"):
            TESTNAME = currentValue
            print(f"Test name: {TESTNAME}")
        elif currentArgument in ("-i", "--Instance"):
            INSTANCE_TYPE = currentValue
            print(f"Instance type: {INSTANCE_TYPE}")
        elif currentArgument in ("-o", "--OS"):
            OS = currentValue
            print(f"Operating system: {OS}")
        elif currentArgument in ("-e", "--Feature rate"):
            FEATURE_RATE = currentValue
            print(f"Feature rate: {FEATURE_RATE}")
        elif currentArgument in ("-f", "--File"):
            FILENAME = currentValue
            print(f"Writing metrics to csv file: {FILENAME}")
        elif currentArgument in ("-s", "--Start"):
            TEST_START = datetime.fromtimestamp(int(currentValue), timezone.utc)
            TEST_END = TEST_START + timedelta(seconds = 600)
            print(f"Test start time: {TEST_START}")
            print(f"Test end time: {TEST_END}")
except getopt.error as err:
    # output error, and return with an error code
    print (str(err))

client = boto3.client('cloudwatch')

# List of metrics we are collecting from aws cloudwatch
METRICS_LIST = [
    ("CPUUtilization", "Percent"),
    ("mem_used_percent", "Percent"),
    ('NetworkIn', 'Bytes'), 
    ('NetworkOut', 'Bytes')]

# Field names for csv file
FIELDNAMES = [
    'Test', 
    'OS', 
    'InstanceType', 
    'FeatureRate',
    'Label', 
    'Timestamp', 
    'Unit', 
    'Average', 
    'Minimum', 
    'Maximum']

metric_dicts = []
def get_metrics(aws_response, statistic_list, test_name):
    """Reformat metrics

    Args:
        aws_response (dict): Response from AWS Cloudwatch
        statistic_list (list): List of statistics for metrics

    Returns:
        list: List of dictionaries containing metrics
    """
    metrics = []
    for datapoint in aws_response['Datapoints']:
        metric = {}

        metric['Test'] = test_name
        metric['OS'] = OS
        metric['InstanceType'] = INSTANCE_TYPE
        metric['FeatureRate'] = FEATURE_RATE
        metric['Label'] = aws_response['Label']
        metric['Timestamp'] = datapoint['Timestamp'].timestamp()
        metric['Unit'] = datapoint['Unit']

        for stat in statistic_list:
            metric[stat] = datapoint[stat]
        metrics.append(metric)
    return metrics


def get_aws_metrics(instance_id, metric_name, statistic_list, statistic_unit):
    """Collect metrics from AWS Cloudwatch

    Args:
        instance_id (String): Instance ID
        metric_name (String): Name of the metric
        statistic_list (List): List of statistics for metrics
        statistic_unit (String): Unit of the metric
    """
    if metric_name == "mem_used_percent":
        metric_ns = "CWAgent"
        metric_dms = {'Name': 'host', 'Value': "ip-172-31-37-139.us-west-2.compute.internal"}
    else:
        metric_ns = "AWS/EC2"
        metric_dms = {'Name': 'InstanceId', 'Value': instance_id}
    response = client.get_metric_statistics(
            Namespace = metric_ns,
            Period = 60,
            StartTime = TEST_START,
            EndTime = TEST_END,
            MetricName = metric_name,
            Statistics=statistic_list, Unit=statistic_unit,
            Dimensions = [
                metric_dms
            ])
    return get_metrics(response, statistic_list, TESTNAME)

def write_metrics_to_csv(csv_filename, fields):
    """Write metrics to csv file

    Args:
        csv_filename (string): Name of the csv file
        fields (list): List of field names
    """
    # writing to csv file
    write_new = True if not Path(csv_filename).exists() else False
    with open(csv_filename, 'a', encoding='utf-8') as csvfile:
        # creating a csv dict writer object
        writer = csv.DictWriter(csvfile, fieldnames=fields)

        if write_new:
            # writing headers (field names)
            writer.writeheader()

        # writing data rows
        writer.writerows(metric_dicts)

for aws_metric, unit in METRICS_LIST:
    metric_dict = get_aws_metrics("i-0d323170857b1494d",
                                  aws_metric,
                                  ['Average', 'Minimum', 'Maximum'],
                                  unit)
    metric_dicts.extend(metric_dict)

write_metrics_to_csv(FILENAME, FIELDNAMES)
