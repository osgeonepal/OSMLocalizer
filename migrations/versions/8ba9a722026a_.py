"""empty message

Revision ID: 8ba9a722026a
Revises: 1bfe999ab7ad
Create Date: 2023-06-06 21:13:27.793951

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "8ba9a722026a"
down_revision = "1bfe999ab7ad"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("feature", schema=None) as batch_op:
        batch_op.add_column(sa.Column("last_status", sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("feature", schema=None) as batch_op:
        batch_op.drop_column("last_status")

    # ### end Alembic commands ###