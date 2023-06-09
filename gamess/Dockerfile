FROM debian:bullseye-slim AS base

RUN apt-get update \
 && apt-get install -y tcsh gfortran libopenmpi-dev \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/*


FROM base AS builder-base

RUN apt-get update \
 && apt-get install -y --no-install-recommends make gcc \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/*


FROM builder-base AS openblas

ARG OPENBLAS=0.3.23

WORKDIR /opt

COPY OpenBLAS-${OPENBLAS}.tar.gz OpenBLAS.tar.gz

RUN echo "\n\n\nExtracting OpenBLAS\n\n\n" \
   && tar -xf OpenBLAS.tar.gz \
   && rm -rf OpenBLAS.tar.gz \
   && mv /opt/OpenBLAS-${OPENBLAS} /opt/OpenBLAS

WORKDIR /opt/OpenBLAS

RUN make -j`grep -c ^processor /proc/cpuinfo` BINARY=64 INTERFACE64=1 USE_THREAD=0

FROM builder-base AS gamess

WORKDIR /usr/local/bin/

RUN apt-get update \
 && apt-get install -y python3 python3-pip \
 && apt-get -y clean \
 && rm -rf /var/lib/apt/lists/*

RUN pip install Jinja2

RUN mkdir -p /usr/lib/openblas
COPY --from=openblas /opt/OpenBLAS/libopenblas.* /usr/lib/openblas/

COPY gamess-current.tar.gz gamess.tar.gz

RUN echo "\n\n\nExtracting GAMESS\n\n\n" \
   && tar -xf gamess.tar.gz \
   && rm -rf gamess.tar.gz \
   && cd /usr/local/bin/gamess \
   && mkdir -p object

WORKDIR /usr/local/bin/gamess

RUN ./bin/create-install-info.py \
      --target=linux64 \
      --fortran=gfortran \
      --fortran_version=`gfortran --version|grep "GNU Fortran"|sed -r "s/^GNU Fortran \(.*\) ([0-9.]+) .*$/\1/g"` \
      --math=openblas \
      --mathlib_path=/usr/lib/openblas \
      --ddi_comm=mpi \
      --mpi_lib=openmpi \
      --mpi_path=/usr/lib/x86_64-linux-gnu/openmpi \
      --rungms

RUN make || : && make || :

FROM base

WORKDIR /usr/local/bin/gamess

RUN useradd -ms /bin/bash gamess && \
      chown root:gamess /usr/local/bin/gamess && \
      chmod 775 /usr/local/bin/gamess

RUN mkdir -p /usr/lib/openblas
COPY --from=openblas /opt/OpenBLAS/libopenblas.* /usr/lib/openblas/
COPY --from=gamess /usr/local/bin/gamess /usr/local/bin/gamess

RUN sed -ir 's/$GMSPATH/$GMS_PATH/g' rungms

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

COPY gms-docker /usr/local/bin/gms-docker
RUN chmod +x /usr/local/bin/gms-docker

COPY rungms.MPI /usr/local/bin/rungms.MPI
RUN chmod +x /usr/local/bin/rungms.MPI

USER gamess
WORKDIR /home/gamess

RUN cat /usr/local/bin/gamess/install.info

ENTRYPOINT [ "/usr/local/bin/gms-docker" ]

