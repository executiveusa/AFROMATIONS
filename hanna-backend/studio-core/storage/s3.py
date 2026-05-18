import uuid
from typing import Optional

import boto3
from botocore.exceptions import ClientError

from config import settings


def get_s3_client():
    protocol = "https" if settings.minio_secure else "http"
    return boto3.client(
        "s3",
        endpoint_url=f"{protocol}://{settings.minio_endpoint}",
        aws_access_key_id=settings.minio_access_key,
        aws_secret_access_key=settings.minio_secret_key,
        region_name="us-east-1",
    )


def ensure_bucket() -> None:
    client = get_s3_client()
    try:
        client.head_bucket(Bucket=settings.minio_bucket)
    except ClientError:
        client.create_bucket(Bucket=settings.minio_bucket)


def upload_bytes(
    data: bytes,
    key: Optional[str] = None,
    content_type: str = "application/octet-stream",
) -> tuple[str, str]:
    """Upload bytes to MinIO. Returns (public_url, s3_key)."""
    if key is None:
        key = str(uuid.uuid4())
    client = get_s3_client()
    client.put_object(
        Bucket=settings.minio_bucket,
        Key=key,
        Body=data,
        ContentType=content_type,
    )
    protocol = "https" if settings.minio_secure else "http"
    url = f"{protocol}://{settings.minio_endpoint}/{settings.minio_bucket}/{key}"
    return url, key


def generate_presigned_url(s3_key: str, expires: int = 3600) -> str:
    client = get_s3_client()
    return client.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.minio_bucket, "Key": s3_key},
        ExpiresIn=expires,
    )
