FROM debian:bullseye-slim AS openblas

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    make gcc gfortran \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/*

ARG OPENBLAS=0.3.21

WORKDIR /opt

COPY OpenBLAS-${OPENBLAS}.tar.gz OpenBLAS.tar.gz

RUN echo "\n\n\nExtracting OpenBLAS\n\n\n" \
   && tar -xf OpenBLAS.tar.gz \
   && rm -rf OpenBLAS.tar.gz \
   && mv /opt/OpenBLAS-${OPENBLAS} /opt/OpenBLAS

WORKDIR /opt/OpenBLAS

RUN make -j`grep -c ^processor /proc/cpuinfo` BINARY=64 INTERFACE64=1



FROM debian:bullseye-slim AS base

RUN apt-get update \
 && apt-get install -y csh gfortran \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/lib/openblas
COPY --from=openblas /opt/OpenBLAS/libopenblas.* /usr/lib/openblas/



FROM base AS builder

WORKDIR /usr/local/bin/

RUN apt-get update \
 && apt-get install -y python3 python3-pip make gcc \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/*

RUN export PATH=$PATH:/usr/bin/

COPY gamess-current.tar.gz gamess.tar.gz

RUN echo "\n\n\nExtracting GAMESS\n\n\n" \
   && tar -xf gamess.tar.gz \
   && rm -rf gamess.tar.gz \
   && cd /usr/local/bin/gamess \
   && mkdir -p object

RUN pip install Jinja2

WORKDIR /usr/local/bin/gamess

RUN ./bin/create-install-info.py \
      --target=linux64 \
      --fortran=gfortran \
      --fortran_version=`gfortran --version|grep "GNU Fortran"|sed -r "s/^GNU Fortran \(.*\) ([0-9.]+) .*$/\1/g"` \
      --math=openblas \
      --mathlib_path=/usr/lib/openblas \
      --rungms

RUN make -j`grep -c ^processor /proc/cpuinfo`||true

FROM base

WORKDIR /usr/local/bin/gamess

COPY --from=builder /usr/local/bin/gamess /usr/local/bin/gamess

RUN rm -rf /usr/local/bin/gamess/docs-*.txt; \
    rm -rf /usr/local/bin/gamess/*.md; \
    rm -rf /usr/local/bin/gamess/ddi; \
    rm -rf /usr/local/bin/gamess/graphics; \
    rm -rf /usr/local/bin/gamess/libcchem; \
    rm -rf /usr/local/bin/gamess/machines; \
    rm -rf /usr/local/bin/gamess/misc; \
    rm -rf /usr/local/bin/gamess/object; \
    rm -rf /usr/local/bin/gamess/qmnuc; \
    rm -rf /usr/local/bin/gamess/source; \
    rm -rf /usr/local/bin/gamess/tools; \
    rm -rf /usr/local/bin/gamess/vb2000; \
    rm -rf /usr/local/bin/gamess/tests; \
    rm -rf /usr/local/bin/gamess/exam*.log;

RUN cat /usr/local/bin/gamess/install.info
